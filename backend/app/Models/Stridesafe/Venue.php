<?php

namespace App\Models\Stridesafe;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Venue model - READ-ONLY from stridesafe database
 */
class Venue extends Model
{
    protected $connection = 'stridesafe';
    protected $table = 'venues';
    public $timestamps = false;

    protected $fillable = [
        'code',
        'name',
        'abbrev',
    ];

    /**
     * Get all meetings at this venue
     */
    public function meetings(): HasMany
    {
        return $this->hasMany(Meeting::class, 'venue_id');
    }

    /**
     * Get all courses at this venue
     */
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class, 'venue_id');
    }
}

