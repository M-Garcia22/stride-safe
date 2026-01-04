<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HorseController extends Controller
{
    /**
     * Get horses for the authenticated trainer with their recent race/welfare data
     * Optimized to use a single query instead of N+1
     */
    public function trainerHorses(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Validate user is a trainer
        if ($user->user_type !== 'trainer') {
            return response()->json([
                'message' => 'Only trainers can access trainer horses',
            ], 403);
        }

        // Get trainer code
        $trainerCode = $this->getTrainerCode($user);

        if (!$trainerCode) {
            return response()->json([
                'horses' => [],
                'meta' => [
                    'total' => 0,
                    'message' => 'No trainer code configured',
                ],
            ]);
        }

        // Single optimized query: Get all entries for this trainer with horse and welfare data
        // Limited to last 90 days for performance
        $startDate = Carbon::now()->subDays(90)->format('Y-m-d');
        
        $entries = DB::connection('stridesafe')
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
            ->select([
                'h.id as horse_id',
                'h.name as horse_name',
                'h.DOB',
                'h.sire',
                'h.dam',
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
            ->orderBy('h.id')
            ->orderBy('m.date', 'desc')
            ->get();

        // Group entries by horse
        $horseData = [];
        foreach ($entries as $entry) {
            $horseId = $entry->horse_id;
            
            if (!isset($horseData[$horseId])) {
                $horseData[$horseId] = [
                    'id' => (string) $horseId,
                    'name' => $this->cleanHorseName($entry->horse_name),
                    'yearOfBirth' => $entry->DOB ? Carbon::parse($entry->DOB)->year : null,
                    'sire' => $entry->sire,
                    'dam' => $entry->dam,
                    'entries' => [],
                ];
            }
            
            // Only keep first 5 entries per horse
            if (count($horseData[$horseId]['entries']) < 5) {
                $horseData[$horseId]['entries'][] = $entry;
            }
        }

        // Transform to final format
        $formattedHorses = collect($horseData)->map(function ($horse) {
            $entries = collect($horse['entries']);
            
            // Get risk history (entries with welfare data)
            $riskHistory = $entries
                ->filter(fn($e) => $e->risk_flag !== null)
                ->pluck('risk_flag')
                ->values()
                ->toArray();

            // Get most recent entry with welfare data
            $mostRecent = $entries->first(fn($e) => $e->risk_flag !== null);
            
            // Calculate days since last race
            $lastRaceDate = $entries->first()?->race_date;
            $daysSinceLastRace = $lastRaceDate 
                ? (int) Carbon::parse($lastRaceDate)->diffInDays(Carbon::now())
                : null;

            return [
                'id' => $horse['id'],
                'name' => $horse['name'],
                'yearOfBirth' => $horse['yearOfBirth'],
                'sire' => $horse['sire'],
                'dam' => $horse['dam'],
                'daysSinceLastRace' => $daysSinceLastRace,
                'riskHistory' => $riskHistory,
                'recentFatigue' => $mostRecent 
                    ? $this->calculateFatigueScore($mostRecent->fatigue_index)
                    : null,
                'hasAlert' => $mostRecent ? $mostRecent->risk_flag >= 3 : false,
                'totalRaces' => $entries->count(),
                'recentReports' => $entries->map(function ($entry) use ($horse) {
                    return [
                        'id' => $entry->entry_id,
                        'date' => $entry->race_date,
                        'track' => $entry->venue_abbrev ?? $entry->venue_name,
                        'raceNo' => $entry->race_number,
                        'distance' => $this->formatDistance($entry->distance),
                        'surface' => $this->formatSurface($entry->surface_type),
                        'welfareRiskCategory' => $entry->risk_flag,
                        'fatigueScore' => $this->calculateFatigueScore($entry->fatigue_index),
                        'welfareAlert' => $entry->risk_flag >= 3,
                        'horseName' => $horse['name'],
                        'condylarFx' => (bool) $entry->condylar_flag,
                        'sesamoidFx' => (bool) $entry->sesamoid_flag,
                        'leftFront' => (bool) $entry->left_front,
                        'rightFront' => (bool) $entry->right_front,
                        'bothFront' => (bool) $entry->both_front,
                        'hindLimb' => (bool) $entry->hind_limb,
                    ];
                })->values()->toArray(),
            ];
        });

        // Sort by most recent race date
        $sortedHorses = $formattedHorses->sortBy('daysSinceLastRace')->values();

        return response()->json([
            'horses' => $sortedHorses,
            'meta' => [
                'total' => $sortedHorses->count(),
                'trainerCode' => $trainerCode,
            ],
        ]);
    }

    /**
     * Get trainer code for the user
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

    /**
     * Convert distance in meters to furlongs display string
     */
    private function formatDistance(int $meters): string
    {
        $furlongs = $meters / 201.168;
        
        if ($furlongs >= 8) {
            $miles = floor($furlongs / 8);
            $remainingFurlongs = round($furlongs - ($miles * 8));
            if ($remainingFurlongs > 0) {
                return sprintf('%dm %df', $miles, $remainingFurlongs);
            }
            return sprintf('%dm', $miles);
        }
        
        return sprintf('%df', round($furlongs));
    }

    /**
     * Convert surface type code to display string
     */
    private function formatSurface(?string $type): string
    {
        return match ($type) {
            'D' => 'Dirt',
            'T' => 'Turf',
            'A' => 'All-Weather',
            'S' => 'Synthetic',
            default => $type ?? 'Unknown',
        };
    }

    /**
     * Calculate fatigue score from FrontLimb_INDEX
     */
    private function calculateFatigueScore(?float $frontlimbIndex): ?int
    {
        if ($frontlimbIndex === null) {
            return null;
        }
        
        $normalized = (($frontlimbIndex - 40) / 20) * 100;
        return (int) max(0, min(100, $normalized));
    }

    /**
     * Clean horse name (remove state suffix like "(KY)")
     */
    private function cleanHorseName(string $name): string
    {
        return trim(preg_replace('/\s*\([A-Z]{2,3}\)\s*$/', '', $name));
    }
}
