<?php

namespace App\Models\Stridesafe;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Meeting model - READ-ONLY from stridesafe database
 */
class Meeting extends Model
{
    protected $connection = 'stridesafe';
    protected $table = 'meetings';
    public $timestamps = false;

    protected $fillable = [
        'club_id',
        'venue_id',
        'code',
        'date',
        'course_desc',
        'type',
        'cancelled',
    ];

    /**
     * Get the venue for this meeting
     */
    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class, 'venue_id');
    }

    /**
     * Get all races in this meeting
     */
    public function races(): HasMany
    {
        return $this->hasMany(Race::class, 'meeting_id');
    }
}

