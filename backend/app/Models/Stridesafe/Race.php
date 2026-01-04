<?php

namespace App\Models\Stridesafe;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Race model - READ-ONLY from stridesafe database
 */
class Race extends Model
{
    protected $connection = 'stridesafe';
    protected $table = 'races';
    public $timestamps = false;

    protected $fillable = [
        'meeting_id',
        'condition_id',
        'course_id',
        'code',
        'distance',
        'local_start_time',
        'utc_time',
        'cancelled',
        'number',
        'name_race_form',
    ];

    /**
     * Get the meeting for this race
     */
    public function meeting(): BelongsTo
    {
        return $this->belongsTo(Meeting::class, 'meeting_id');
    }

    /**
     * Get the course for this race
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    /**
     * Get all entries in this race
     */
    public function entries(): HasMany
    {
        return $this->hasMany(Entry::class, 'race_id');
    }

    /**
     * Convert distance in meters to furlongs string
     */
    public function getDistanceDisplayAttribute(): string
    {
        $meters = $this->distance;
        $furlongs = $meters / 201.168; // 1 furlong = 201.168 meters
        
        if ($furlongs >= 8) {
            $miles = floor($furlongs / 8);
            $remainingFurlongs = $furlongs - ($miles * 8);
            if ($remainingFurlongs > 0) {
                return sprintf('%dm %df', $miles, round($remainingFurlongs));
            }
            return sprintf('%dm', $miles);
        }
        
        return sprintf('%df', round($furlongs, 1));
    }
}

