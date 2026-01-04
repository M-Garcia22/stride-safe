<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Stridesafe\Entry;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Get trainer reports for the authenticated trainer
     * Returns welfare reports for horses trained by the authenticated user
     */
    public function trainerReports(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Validate user is a trainer
        if ($user->user_type !== 'trainer') {
            return response()->json([
                'message' => 'Only trainers can access trainer reports',
            ], 403);
        }

        // Get days parameter (default 7 days)
        $days = $request->input('days', 7);
        $days = min(max((int) $days, 1), 90); // Clamp between 1-90 days

        // Calculate date range
        $startDate = Carbon::now()->subDays($days)->format('Y-m-d');

        // Get trainer code - use demo config if enabled and no trainer_code set
        $trainerCode = $this->getTrainerCode($user);

        // Query entries with welfare data for this trainer
        $query = DB::connection('stridesafe')
            ->table('entries as e')
            ->join('horses as h', 'e.horse_id', '=', 'h.id')
            ->join('races as r', 'e.race_id', '=', 'r.id')
            ->join('meetings as m', 'r.meeting_id', '=', 'm.id')
            ->join('venues as v', 'm.venue_id', '=', 'v.id')
            ->leftJoin('courses as c', 'r.course_id', '=', 'c.id')
            ->join('race_data_v4 as rd', 'e.code', '=', 'rd.entry_code')
            ->where('m.date', '>=', $startDate)
            ->where('e.scratched', '=', 0)
            ->whereNotNull('rd.Final_Traficlight_FLAG');

        // Filter by trainer if trainer_code is set
        if ($trainerCode) {
            $query->where('e.trainer_name', '=', $trainerCode);
        }

        $reports = $query->select([
                'e.id',
                'e.code as entry_code',
                'e.trainer_name',
                'h.name as horse_name',
                'm.date as meeting_date',
                'v.name as venue_name',
                'v.abbrev as venue_abbrev',
                'r.number as race_number',
                'r.distance',
                'c.type as surface_type',
                'rd.Final_Traficlight_FLAG as welfare_flag',
                'rd.FrontLimb_INDEX as frontlimb_index',
                'rd.Condylar_FLAG as condylar_flag',
                'rd.Sesamoid_FLAG as sesamoid_flag',
                'rd.LF as left_front',
                'rd.RF as right_front',
                'rd.BF as both_front',
                'rd.HL_FLAG as hind_limb',
            ])
            ->orderBy('m.date', 'desc')
            ->orderBy('r.local_start_time', 'desc')
            ->limit(50)
            ->get();

        // Transform to frontend Report format
        $formattedReports = $reports->map(function ($report) {
            return [
                'id' => $report->id,
                'date' => $report->meeting_date,
                'track' => $report->venue_abbrev ?? $report->venue_name,
                'raceNo' => $report->race_number,
                'distance' => $this->formatDistance($report->distance),
                'surface' => $this->formatSurface($report->surface_type),
                'welfareRiskCategory' => $report->welfare_flag,
                'fatigueScore' => $this->calculateFatigueScore($report->frontlimb_index),
                'welfareAlert' => $report->welfare_flag >= 3,
                'isNew' => Carbon::parse($report->meeting_date)->isAfter(Carbon::now()->subDays(2)),
                'horseName' => $this->cleanHorseName($report->horse_name),
                'condylarFx' => (bool) $report->condylar_flag,
                'sesamoidFx' => (bool) $report->sesamoid_flag,
                'leftFront' => (bool) $report->left_front,
                'rightFront' => (bool) $report->right_front,
                'bothFront' => (bool) $report->both_front,
                'hindLimb' => (bool) $report->hind_limb,
                'trainerName' => $report->trainer_name,
            ];
        });

        return response()->json([
            'reports' => $formattedReports,
            'meta' => [
                'days' => $days,
                'total' => $formattedReports->count(),
                'newCount' => $formattedReports->where('isNew', true)->count(),
            ],
        ]);
    }

    /**
     * Get all recent reports (for track officials)
     */
    public function allReports(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Validate user is a track official
        if ($user->user_type !== 'track') {
            return response()->json([
                'message' => 'Only track officials can access all reports',
            ], 403);
        }

        $days = $request->input('days', 7);
        $days = min(max((int) $days, 1), 90);
        $startDate = Carbon::now()->subDays($days)->format('Y-m-d');

        $reports = DB::connection('stridesafe')
            ->table('entries as e')
            ->join('horses as h', 'e.horse_id', '=', 'h.id')
            ->join('races as r', 'e.race_id', '=', 'r.id')
            ->join('meetings as m', 'r.meeting_id', '=', 'm.id')
            ->join('venues as v', 'm.venue_id', '=', 'v.id')
            ->leftJoin('courses as c', 'r.course_id', '=', 'c.id')
            ->join('race_data_v4 as rd', 'e.code', '=', 'rd.entry_code')
            ->where('m.date', '>=', $startDate)
            ->where('e.scratched', '=', 0)
            ->whereNotNull('rd.Final_Traficlight_FLAG')
            ->select([
                'e.id',
                'e.code as entry_code',
                'e.trainer_name',
                'h.name as horse_name',
                'm.date as meeting_date',
                'v.name as venue_name',
                'v.abbrev as venue_abbrev',
                'r.number as race_number',
                'r.distance',
                'c.type as surface_type',
                'rd.Final_Traficlight_FLAG as welfare_flag',
                'rd.FrontLimb_INDEX as frontlimb_index',
                'rd.Condylar_FLAG as condylar_flag',
                'rd.Sesamoid_FLAG as sesamoid_flag',
                'rd.LF as left_front',
                'rd.RF as right_front',
                'rd.BF as both_front',
                'rd.HL_FLAG as hind_limb',
            ])
            ->orderBy('m.date', 'desc')
            ->orderBy('r.local_start_time', 'desc')
            ->limit(100)
            ->get();

        $formattedReports = $reports->map(function ($report) {
            return [
                'id' => $report->id,
                'date' => $report->meeting_date,
                'track' => $report->venue_abbrev ?? $report->venue_name,
                'raceNo' => $report->race_number,
                'distance' => $this->formatDistance($report->distance),
                'surface' => $this->formatSurface($report->surface_type),
                'welfareRiskCategory' => $report->welfare_flag,
                'fatigueScore' => $this->calculateFatigueScore($report->frontlimb_index),
                'welfareAlert' => $report->welfare_flag >= 3,
                'isNew' => Carbon::parse($report->meeting_date)->isAfter(Carbon::now()->subDays(2)),
                'horseName' => $this->cleanHorseName($report->horse_name),
                'condylarFx' => (bool) $report->condylar_flag,
                'sesamoidFx' => (bool) $report->sesamoid_flag,
                'leftFront' => (bool) $report->left_front,
                'rightFront' => (bool) $report->right_front,
                'bothFront' => (bool) $report->both_front,
                'hindLimb' => (bool) $report->hind_limb,
                'trainerName' => $report->trainer_name,
            ];
        });

        return response()->json([
            'reports' => $formattedReports,
            'meta' => [
                'days' => $days,
                'total' => $formattedReports->count(),
                'newCount' => $formattedReports->where('isNew', true)->count(),
            ],
        ]);
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
     * FrontLimb_INDEX typically ranges 40-60
     * We invert and scale to 0-100 where higher = more fatigued
     */
    private function calculateFatigueScore(?float $frontlimbIndex): int
    {
        if ($frontlimbIndex === null) {
            return 50;
        }
        
        // Scale from ~40-60 range to 0-100
        // Higher index = more stress = higher fatigue score
        $normalized = (($frontlimbIndex - 40) / 20) * 100;
        return (int) max(0, min(100, $normalized));
    }

    /**
     * Clean horse name (remove state suffix like "(KY)")
     */
    private function cleanHorseName(string $name): string
    {
        // Remove state/country suffix like "(KY)", "(NY)", etc.
        return trim(preg_replace('/\s*\([A-Z]{2,3}\)\s*$/', '', $name));
    }

    /**
     * Get trainer code for the user
     * Uses demo config if enabled and user has no trainer_code set
     */
    private function getTrainerCode($user): ?string
    {
        // If user has a trainer_code set, use it
        if (!empty($user->trainer_code)) {
            return $user->trainer_code;
        }

        // If demo mode is enabled, use the demo trainer_code
        if (config('demo.enabled', false)) {
            return config('demo.trainer_code');
        }

        // No trainer code available
        return null;
    }
}

