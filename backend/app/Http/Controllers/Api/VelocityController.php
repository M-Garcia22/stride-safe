<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VelocityController extends Controller
{
    // Database stores velocity in m/s, convert to fps for display
    private const MPS_TO_FPS = 3.28084;
    private const TARGET_VELOCITY_FPS = 52;

    /**
     * Get velocity data for a specific entry (race performance)
     * 
     * @param int $entryCode The entry code from the entries table
     */
    public function show(Request $request, int $entryCode): JsonResponse
    {
        // Fetch velocity data from race_data table (stored in m/s)
        $velocityData = DB::connection('stridesafe')
            ->table('race_data')
            ->where('entry_code', $entryCode)
            ->orderBy('time_index')
            ->select(['time_index', 'sm_vel', 'sm_accel'])
            ->get();

        if ($velocityData->isEmpty()) {
            return response()->json([
                'message' => 'No velocity data found for this entry',
                'data' => null,
            ], 404);
        }

        // Convert m/s to fps and format for frontend charts
        $fullRaceData = $velocityData->map(fn($row) => [
            'time' => (int) $row->time_index,
            'velocity' => round((float) $row->sm_vel * self::MPS_TO_FPS, 2),
            'acceleration' => round((float) $row->sm_accel * self::MPS_TO_FPS, 4),
        ])->values()->toArray();

        // First 10 seconds for the acceleration phase chart
        $first10Seconds = array_values(array_filter(
            $fullRaceData, 
            fn($point) => $point['time'] <= 10
        ));

        // Calculate metrics
        $maxVelocity = max(array_column($fullRaceData, 'velocity'));
        $peakTimeIndex = array_search($maxVelocity, array_column($fullRaceData, 'velocity'));
        $timeToPeak = $fullRaceData[$peakTimeIndex]['time'] ?? 0;

        // Time to reach target velocity (52 fps)
        $timeToTarget = null;
        $velocityAtTarget = null;
        foreach ($fullRaceData as $point) {
            if ($point['velocity'] >= self::TARGET_VELOCITY_FPS) {
                $timeToTarget = $point['time'];
                $velocityAtTarget = $point['velocity'];
                break;
            }
        }

        return response()->json([
            'entryCode' => $entryCode,
            'fullRace' => $fullRaceData,
            'first10Seconds' => $first10Seconds,
            'metrics' => [
                'maxVelocity' => round($maxVelocity, 2),
                'timeToPeak' => $timeToPeak,
                'timeToTarget' => $timeToTarget,
                'velocityAtTarget' => $velocityAtTarget ? round($velocityAtTarget, 2) : null,
                'targetVelocity' => self::TARGET_VELOCITY_FPS,
                'totalDuration' => count($fullRaceData),
            ],
            'units' => [
                'velocity' => 'fps',
                'acceleration' => 'fps²',
                'time' => 'seconds',
            ],
        ]);
    }
}

