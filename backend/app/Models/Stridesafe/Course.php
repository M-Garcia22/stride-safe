<?php

namespace App\Models\Stridesafe;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Course model - READ-ONLY from stridesafe database
 */
class Course extends Model
{
    protected $connection = 'stridesafe';
    protected $table = 'courses';
    public $timestamps = false;

    protected $fillable = [
        'venue_id',
        'name',
        'course_code',
        'type', // 'D' = Dirt, 'T' = Turf
    ];

    /**
     * Get the venue for this course
     */
    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class, 'venue_id');
    }

    /**
     * Get all races on this course
     */
    public function races(): HasMany
    {
        return $this->hasMany(Race::class, 'course_id');
    }

    /**
     * Get human-readable surface type
     */
    public function getSurfaceAttribute(): string
    {
        return match ($this->type) {
            'D' => 'Dirt',
            'T' => 'Turf',
            default => 'Unknown',
        };
    }
}

