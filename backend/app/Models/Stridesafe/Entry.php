<?php

namespace App\Models\Stridesafe;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Entry model - READ-ONLY from stridesafe database
 * Represents a horse's entry in a race
 */
class Entry extends Model
{
    protected $connection = 'stridesafe';
    protected $table = 'entries';
    public $timestamps = false;

    protected $fillable = [
        'race_id',
        'horse_id',
        'code',
        'tab_number',
        'barrier_number',
        'scratched',
        'dnf',
        'assigned_tracker',
        'tracker_id',
        'launch_time',
        'finish_time',
        'official_time',
        'official_position',
        'official_margin',
        'handicap',
        'trainer_name',
    ];

    /**
     * Get the race for this entry
     */
    public function race(): BelongsTo
    {
        return $this->belongsTo(Race::class, 'race_id');
    }

    /**
     * Get the horse for this entry
     */
    public function horse(): BelongsTo
    {
        return $this->belongsTo(Horse::class, 'horse_id');
    }

    /**
     * Get the race data v4 (welfare flags) for this entry
     */
    public function raceDataV4(): HasOne
    {
        return $this->hasOne(RaceDataV4::class, 'entry_code', 'code');
    }
}

