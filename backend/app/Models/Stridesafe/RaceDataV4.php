<?php

namespace App\Models\Stridesafe;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * RaceDataV4 model - READ-ONLY from stridesafe database
 * Contains traffic light flags and injury risk indicators
 */
class RaceDataV4 extends Model
{
    protected $connection = 'stridesafe';
    protected $table = 'race_data_v4';
    public $timestamps = false;

    protected $fillable = [
        'entry_code',
        'Final_Traficlight_FLAG',
        'FrontLimb_INDEX',
        'Frontlimb_FLAG',
        'Condylar_FLAG',
        'Sesamoid_FLAG',
        'FL_ML_FLAG',
        'LF',
        'RF',
        'BF',
        'HL_FLAG',
        'Trafficlight_INDEX',
    ];

    protected $casts = [
        'Final_Traficlight_FLAG' => 'integer',
        'FrontLimb_INDEX' => 'float',
        'Frontlimb_FLAG' => 'integer',
        'Condylar_FLAG' => 'integer',
        'Sesamoid_FLAG' => 'integer',
        'FL_ML_FLAG' => 'integer',
        'LF' => 'integer',
        'RF' => 'integer',
        'BF' => 'integer',
        'HL_FLAG' => 'integer',
        'Trafficlight_INDEX' => 'float',
    ];

    /**
     * Get the entry for this race data
     */
    public function entry(): BelongsTo
    {
        return $this->belongsTo(Entry::class, 'entry_code', 'code');
    }

    /**
     * Check if this entry has a welfare alert (flag >= 3)
     */
    public function hasWelfareAlert(): bool
    {
        return $this->Final_Traficlight_FLAG >= 3;
    }

    /**
     * Get fatigue score (normalized from FrontLimb_INDEX)
     * FrontLimb_INDEX typically ranges 40-60, we scale to 0-100
     */
    public function getFatigueScoreAttribute(): int
    {
        if ($this->FrontLimb_INDEX === null) {
            return 50; // Default middle value
        }
        
        // Scale from ~40-60 range to 0-100
        // Lower index = better, so we invert
        $normalized = (($this->FrontLimb_INDEX - 40) / 20) * 100;
        return (int) max(0, min(100, 100 - $normalized));
    }
}

