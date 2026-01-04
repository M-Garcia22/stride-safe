<?php

namespace App\Models\Stridesafe;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Horse model - READ-ONLY from stridesafe database
 */
class Horse extends Model
{
    protected $connection = 'stridesafe';
    protected $table = 'horses';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'sire',
        'dam',
        'breeder',
        'inactive',
        'DOB',
    ];

    /**
     * Get all entries for this horse
     */
    public function entries(): HasMany
    {
        return $this->hasMany(Entry::class, 'horse_id');
    }
}

