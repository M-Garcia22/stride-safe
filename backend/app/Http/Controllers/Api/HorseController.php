<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class HorseController extends Controller
{
    /**
     * Get horses for the authenticated trainer with their recent race/welfare data.
     */
    public function trainerHorses(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if ($user->user_type !== 'trainer') {
            return response()->json(['message' => 'Only trainers can access trainer horses'], 403);
        }

        $trainerCode = $this->getTrainerCode($user);

        if (!$trainerCode) {
            return $this->emptyHorseResponse('No trainer code configured');
        }

        // Get entries for this trainer (last 90 days)
        $entries = $this->getTrainerEntries($trainerCode, 90);
        $horseIds = $entries->pluck('horse_id')->unique()->values()->toArray();

        if (empty($horseIds)) {
            return $this->emptyHorseResponse(trainerCode: $trainerCode);
        }

        // Get horse details from tiller_races
        $horseDetails = $this->getHorseDetails($horseIds);

        // Build and format horse data
        $horseData = $this->buildHorseData($entries, $horseDetails);
        $formattedHorses = $this->formatHorses($horseData);

        return response()->json([
            'horses' => $formattedHorses->sortBy('daysSinceLastRace')->values(),
            'meta' => [
                'total' => $formattedHorses->count(),
                'trainerCode' => $trainerCode,
            ],
        ]);
    }

    /**
     * Get horses owned by the trainer (My Stable).
     * Only returns horses where the trainer's exact name appears as owner.
     */
    public function trainerStable(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if ($user->user_type !== 'trainer') {
            return response()->json(['message' => 'Only trainers can access stable data'], 403);
        }

        $trainerCode = $this->getTrainerCode($user);

        if (!$trainerCode) {
            return $this->emptyHorseResponse('No trainer code configured');
        }

        // Get trainer's full name from tiller_races to match against owner
        $trainerFullName = $this->getTrainerFullName($trainerCode);

        if (!$trainerFullName) {
            return $this->emptyHorseResponse(trainerCode: $trainerCode);
        }

        // Find horses where trainer is also the owner
        $ownedHorses = $this->getOwnedHorses($trainerCode, $trainerFullName);

        if ($ownedHorses->isEmpty()) {
            return $this->emptyHorseResponse(trainerCode: $trainerCode);
        }

        // Get race entries for these horses
        $horseIds = $ownedHorses->pluck('horse_id')->toArray();
        $entries = $this->getEntriesForHorses($horseIds);
        $entriesByHorse = $entries->groupBy('horse_id');

        // Build horse data from owned horses + their entries
        $horseData = $this->buildHorseDataFromOwned($ownedHorses, $entriesByHorse);
        $formattedHorses = $this->formatHorses($horseData);

        return response()->json([
            'horses' => $formattedHorses->sortBy(fn($h) => $h['daysSinceLastRace'] ?? PHP_INT_MAX)->values(),
            'meta' => [
                'total' => $formattedHorses->count(),
                'trainerCode' => $trainerCode,
                'ownerName' => $trainerFullName,
            ],
        ]);
    }

    /**
     * Get 180-day race history for a specific horse.
     * Returns data in TrendsEvent format for the 180-Day Report and Welfare & Fatigue tabs.
     * 
     * @param int $days Number of days to look back (0 = all time, max 3650 days/10 years)
     */
    public function horseHistory(Request $request, int $horseId): JsonResponse
    {
        $days = $request->input('days', 180);
        $days = (int) $days;
        
        // Build the query - only include entries with welfare data
        $query = DB::connection('stridesafe')
            ->table('entries as e')
            ->join('horses as h', 'e.horse_id', '=', 'h.id')
            ->join('races as r', 'e.race_id', '=', 'r.id')
            ->join('meetings as m', 'r.meeting_id', '=', 'm.id')
            ->join('venues as v', 'm.venue_id', '=', 'v.id')
            ->leftJoin('courses as c', 'r.course_id', '=', 'c.id')
            ->join('race_data_v4 as rd', 'e.code', '=', 'rd.entry_code') // INNER JOIN to exclude entries without welfare data
            ->where('e.horse_id', '=', $horseId)
            ->where('e.scratched', '=', 0)
            ->whereNotNull('rd.Final_Traficlight_FLAG'); // Only entries with welfare data
        
        // Apply date filter unless days=0 (all time)
        if ($days > 0) {
            $days = min($days, 3650); // Max 10 years
            $startDate = Carbon::now()->subDays($days)->format('Y-m-d');
            $query->where('m.date', '>=', $startDate);
        }
        
        $entries = $query->select([
                'e.code as entry_code',
                'h.name as horse_name',
                'm.date as race_date',
                'v.name as venue_name',
                'v.abbrev as venue_abbrev',
                'r.distance',
                'c.type as surface_type',
                'rd.Final_Traficlight_FLAG as welfare_flag',
                'rd.FrontLimb_INDEX as fatigue_index',
            ])
            ->orderBy('m.date', 'desc')
            ->get();

        // Transform to TrendsEvent format expected by frontend
        $events = $entries->map(function ($entry) {
            // Calculate fatigue score (performanceScore in frontend)
            $fatigueScore = $this->calculateFatigueScore($entry->fatigue_index);
            
            // Welfare flag is the wellnessScore (1-5 scale, but frontend expects higher = better)
            // The chart expects wellnessScore where lower values = higher risk
            // We'll pass the raw welfare flag and let frontend handle display
            $welfareFlag = $entry->welfare_flag;

            return [
                'id' => (string) $entry->entry_code,
                'date' => $entry->race_date,
                'type' => 'race',
                'location' => $entry->venue_abbrev ?? $entry->venue_name,
                'distance' => $this->formatDistance($entry->distance),
                'performanceScore' => $fatigueScore ?? 50, // Fatigue score (0-100)
                'wellnessScore' => $welfareFlag ?? 1, // Welfare risk category (1-5)
                'welfareAlert' => $welfareFlag !== null && $welfareFlag >= 3,
            ];
        })->values()->toArray();

        return response()->json([
            'events' => $events,
            'meta' => [
                'horseId' => $horseId,
                'horseName' => $entries->first()?->horse_name ? $this->cleanHorseName($entries->first()->horse_name) : null,
                'days' => $days,
                'total' => count($events),
            ],
        ]);
    }

    // =========================================================================
    // Query Methods
    // =========================================================================

    /**
     * Get entries for a trainer within a date range.
     */
    private function getTrainerEntries(string $trainerCode, int $days): Collection
    {
        $startDate = Carbon::now()->subDays($days)->format('Y-m-d');
        
        return DB::connection('stridesafe')
            ->table('entries as e')
            ->join('horses as h', 'e.horse_id', '=', 'h.id')
            ->join('races as r', 'e.race_id', '=', 'r.id')
            ->join('meetings as m', 'r.meeting_id', '=', 'm.id')
            ->join('venues as v', 'm.venue_id', '=', 'v.id')
            ->leftJoin('courses as c', 'r.course_id', '=', 'c.id')
            ->leftJoin('race_data_v4 as rd', 'e.code', '=', 'rd.entry_code')
            ->where('e.trainer_name', '=', $trainerCode)
            ->where('e.scratched', '=', 0)
            ->where('m.date', '>=', $startDate)
            ->select($this->getEntrySelectColumns())
            ->orderBy('h.id')
            ->orderBy('m.date', 'desc')
            ->get();
    }

    /**
     * Get entries for specific horse IDs.
     */
    private function getEntriesForHorses(array $horseIds): Collection
    {
        return DB::connection('stridesafe')
            ->table('entries as e')
            ->join('races as r', 'e.race_id', '=', 'r.id')
            ->join('meetings as m', 'r.meeting_id', '=', 'm.id')
            ->join('venues as v', 'm.venue_id', '=', 'v.id')
            ->leftJoin('courses as c', 'r.course_id', '=', 'c.id')
            ->leftJoin('race_data_v4 as rd', 'e.code', '=', 'rd.entry_code')
            ->whereIn('e.horse_id', $horseIds)
            ->where('e.scratched', '=', 0)
            ->select([
                'e.horse_id',
                'e.id as entry_id',
                'e.code as entry_code',
                'm.date as race_date',
                'v.name as venue_name',
                'v.abbrev as venue_abbrev',
                'r.number as race_number',
                'r.distance',
                'c.type as surface_type',
                'rd.Final_Traficlight_FLAG as risk_flag',
                'rd.FrontLimb_INDEX as fatigue_index',
                'rd.Condylar_FLAG as condylar_flag',
                'rd.Sesamoid_FLAG as sesamoid_flag',
                'rd.LF as left_front',
                'rd.RF as right_front',
                'rd.BF as both_front',
                'rd.HL_FLAG as hind_limb',
            ])
            ->orderBy('e.horse_id')
            ->orderBy('m.date', 'desc')
            ->get();
    }

    /**
     * Get horse details from tiller_races (most recent record per horse).
     */
    private function getHorseDetails(array $horseIds): array
    {
        $tillerData = DB::connection('stridesafe')
            ->table('tiller_races')
            ->whereIn('horse_id', $horseIds)
            ->select(['horse_id', 'Sex', 'Sire', 'Dam', 'SireSire', 'DamSire', 'Breeder', 'Owner_Full_Name', 'D'])
            ->orderBy('D', 'desc')
            ->get();

        $details = [];
        foreach ($tillerData as $record) {
            if (!isset($details[$record->horse_id])) {
                $details[$record->horse_id] = $record;
            }
        }
        return $details;
    }

    /**
     * Get trainer's full name from tiller_races based on trainer code.
     */
    private function getTrainerFullName(string $trainerCode): ?string
    {
        $parts = explode(' ', trim($trainerCode));
        $lastName = array_pop($parts);
        $firstInitial = substr($parts[0] ?? '', 0, 1);

        $trainer = DB::connection('stridesafe')
            ->table('tiller_races')
            ->where('Trainer_L_Name', '=', $lastName)
            ->whereRaw('LEFT(Trainer_F_Name, 1) = ?', [$firstInitial])
            ->selectRaw('CONCAT(Trainer_F_Name, " ", COALESCE(Trainer_M_Name, ""), " ", Trainer_L_Name) as full_name')
            ->first();

        return $trainer ? trim(preg_replace('/\s+/', ' ', $trainer->full_name)) : null;
    }

    /**
     * Get horses owned by the trainer (where owner name matches trainer name).
     */
    private function getOwnedHorses(string $trainerCode, string $trainerFullName): Collection
    {
        // Get horse IDs this trainer has trained
        $trainerHorseIds = DB::connection('stridesafe')
            ->table('entries')
            ->where('trainer_name', '=', $trainerCode)
            ->distinct()
            ->pluck('horse_id')
            ->toArray();

        if (empty($trainerHorseIds)) {
            return collect();
        }

        // Find horses where owner matches trainer's full name exactly
        return DB::connection('stridesafe')
            ->table('horses as h')
            ->join('tiller_races as tr', 'tr.horse_id', '=', 'h.id')
            ->whereIn('h.id', $trainerHorseIds)
            ->where(function ($query) use ($trainerFullName) {
                $query->where('tr.Owner_Full_Name', '=', $trainerFullName)
                    ->orWhere('tr.Owner_Full_Name', 'LIKE', $trainerFullName . ' %')
                    ->orWhere('tr.Owner_Full_Name', 'LIKE', $trainerFullName . ',%');
            })
            ->select([
                'h.id as horse_id', 'h.name as horse_name', 'h.DOB',
                'tr.Sex', 'tr.Sire', 'tr.Dam', 'tr.SireSire', 'tr.DamSire',
                'tr.Breeder', 'tr.Owner_Full_Name',
            ])
            ->orderBy('tr.D', 'desc')
            ->get()
            ->unique('horse_id');
    }

    // =========================================================================
    // Data Building Methods
    // =========================================================================

    /**
     * Build horse data array from entries and tiller details.
     */
    private function buildHorseData(Collection $entries, array $horseDetails): array
    {
        $horseData = [];
        
        foreach ($entries as $entry) {
            $horseId = $entry->horse_id;
            $tiller = $horseDetails[$horseId] ?? null;
            
            if (!isset($horseData[$horseId])) {
                $horseData[$horseId] = [
                    'id' => (string) $horseId,
                    'name' => $this->cleanHorseName($entry->horse_name),
                    'yearOfBirth' => $entry->DOB ? Carbon::parse($entry->DOB)->year : null,
                    'sire' => $tiller?->Sire ?? $entry->sire,
                    'dam' => $tiller?->Dam ?? $entry->dam,
                    'sireSire' => $tiller?->SireSire,
                    'damSire' => $tiller?->DamSire,
                    'sex' => $this->formatSex($tiller?->Sex),
                    'breeder' => $tiller?->Breeder,
                    'owner' => $tiller?->Owner_Full_Name,
                    'entries' => [],
                ];
            }
            
            if (count($horseData[$horseId]['entries']) < 5) {
                $horseData[$horseId]['entries'][] = $entry;
            }
        }
        
        return $horseData;
    }

    /**
     * Build horse data from owned horses collection and their entries.
     */
    private function buildHorseDataFromOwned(Collection $ownedHorses, Collection $entriesByHorse): array
    {
        $horseData = [];
        
        foreach ($ownedHorses as $horse) {
            $horseId = $horse->horse_id;
            $horseEntries = $entriesByHorse->get($horseId, collect())->take(5);
            
            $horseData[$horseId] = [
                'id' => (string) $horseId,
                'name' => $this->cleanHorseName($horse->horse_name),
                'yearOfBirth' => $horse->DOB ? Carbon::parse($horse->DOB)->year : null,
                'sire' => $horse->Sire,
                'dam' => $horse->Dam,
                'sireSire' => $horse->SireSire,
                'damSire' => $horse->DamSire,
                'sex' => $this->formatSex($horse->Sex),
                'breeder' => $horse->Breeder,
                'owner' => $horse->Owner_Full_Name,
                'entries' => $horseEntries->toArray(),
            ];
        }
        
        return $horseData;
    }

    /**
     * Format horse data array into final API response format.
     */
    private function formatHorses(array $horseData): Collection
    {
        return collect($horseData)->map(function ($horse) {
            $entries = collect($horse['entries']);
            
            $riskHistory = $entries
                ->filter(fn($e) => $e->risk_flag !== null)
                ->pluck('risk_flag')
                ->values()
                ->toArray();

            $mostRecent = $entries->first(fn($e) => $e->risk_flag !== null);
            $lastRaceDate = $entries->first()?->race_date ?? null;
            
            return [
                'id' => $horse['id'],
                'name' => $horse['name'],
                'yearOfBirth' => $horse['yearOfBirth'],
                'sex' => $horse['sex'],
                'sire' => $horse['sire'],
                'dam' => $horse['dam'],
                'sireSire' => $horse['sireSire'],
                'damSire' => $horse['damSire'],
                'breeder' => $horse['breeder'],
                'owner' => $horse['owner'],
                'daysSinceLastRace' => $lastRaceDate 
                    ? (int) Carbon::parse($lastRaceDate)->diffInDays(Carbon::now()) 
                    : null,
                'riskHistory' => $riskHistory,
                'recentFatigue' => $mostRecent 
                    ? $this->calculateFatigueScore($mostRecent->fatigue_index) 
                    : null,
                'hasAlert' => $mostRecent ? $mostRecent->risk_flag >= 3 : false,
                'totalRaces' => $entries->count(),
                'recentReports' => $this->formatReports($entries, $horse['name']),
            ];
        });
    }

    /**
     * Format entries into report format.
     */
    private function formatReports(Collection $entries, string $horseName): array
    {
        return $entries->map(fn($entry) => [
            'id' => $entry->entry_id,
            'entryCode' => $entry->entry_code,
            'date' => $entry->race_date,
            'track' => $entry->venue_abbrev ?? $entry->venue_name,
            'raceNo' => $entry->race_number,
            'distance' => $this->formatDistance($entry->distance),
            'surface' => $this->formatSurface($entry->surface_type),
            'welfareRiskCategory' => $entry->risk_flag,
            'fatigueScore' => $this->calculateFatigueScore($entry->fatigue_index),
            'welfareAlert' => $entry->risk_flag >= 3,
            'horseName' => $horseName,
            'condylarFx' => (bool) $entry->condylar_flag,
            'sesamoidFx' => (bool) $entry->sesamoid_flag,
            'leftFront' => (bool) $entry->left_front,
            'rightFront' => (bool) $entry->right_front,
            'bothFront' => (bool) $entry->both_front,
            'hindLimb' => (bool) $entry->hind_limb,
        ])->values()->toArray();
    }

    // =========================================================================
    // Helper Methods
    // =========================================================================

    /**
     * Get select columns for entry queries.
     */
    private function getEntrySelectColumns(): array
    {
        return [
            'h.id as horse_id', 'h.name as horse_name', 'h.DOB', 'h.sire', 'h.dam',
            'e.id as entry_id', 'e.code as entry_code',
            'm.date as race_date',
            'v.name as venue_name', 'v.abbrev as venue_abbrev',
            'r.number as race_number', 'r.distance',
            'c.type as surface_type',
            'rd.Final_Traficlight_FLAG as risk_flag',
            'rd.FrontLimb_INDEX as fatigue_index',
            'rd.Condylar_FLAG as condylar_flag',
            'rd.Sesamoid_FLAG as sesamoid_flag',
            'rd.LF as left_front', 'rd.RF as right_front',
            'rd.BF as both_front', 'rd.HL_FLAG as hind_limb',
        ];
    }

    /**
     * Return empty horse response.
     */
    private function emptyHorseResponse(?string $message = null, ?string $trainerCode = null): JsonResponse
    {
        $meta = ['total' => 0];
        if ($message) $meta['message'] = $message;
        if ($trainerCode) $meta['trainerCode'] = $trainerCode;
        
        return response()->json(['horses' => [], 'meta' => $meta]);
    }

    /**
     * Get trainer code from user or demo config.
     */
    private function getTrainerCode($user): ?string
    {
        if (!empty($user->trainer_code)) {
            return $user->trainer_code;
        }

        if (config('demo.enabled', false)) {
            return config('demo.trainer_code');
        }

        return null;
    }

    private function formatSex(?string $sex): string
    {
        return match ($sex) {
            'C' => 'Colt', 'F' => 'Filly', 'M' => 'Mare',
            'H' => 'Horse', 'G' => 'Gelding', 'R' => 'Ridgling',
            default => 'Unknown',
        };
    }

    private function formatDistance(int $meters): string
    {
        $furlongs = $meters / 201.168;
        
        if ($furlongs >= 8) {
            $miles = floor($furlongs / 8);
            $remaining = round($furlongs - ($miles * 8));
            return $remaining > 0 ? sprintf('%dm %df', $miles, $remaining) : sprintf('%dm', $miles);
        }
        
        return sprintf('%df', round($furlongs));
    }

    private function formatSurface(?string $type): string
    {
        return match ($type) {
            'D' => 'Dirt', 'T' => 'Turf', 'A' => 'All-Weather', 'S' => 'Synthetic',
            default => $type ?? 'Unknown',
        };
    }

    private function calculateFatigueScore(?float $frontlimbIndex): ?int
    {
        if ($frontlimbIndex === null) return null;
        return (int) max(0, min(100, (($frontlimbIndex - 40) / 20) * 100));
    }

    private function cleanHorseName(string $name): string
    {
        return trim(preg_replace('/\s*\([A-Z]{2,3}\)\s*$/', '', $name));
    }
}
