<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    protected $fillable = [
        'name', 'program_days', 'departure_date', 'airline', 'airline_route', 
        'price', 'harga_agen', 'hotel_makkah', 'hotel_madinah', 'included', 'not_included', 
        'bonus', 'total_seats', 'available_seats', 'free_items', 'includes',
        'excludes', 'image', 'is_active', 'code', 'is_best_seller',
        'manifest_status', 'manifest_version', 'manifest_locked_by', 'manifest_locked_at'
    ];

    protected function casts(): array
    {
        return [
            'included' => 'array',
            'not_included' => 'array',
            'bonus' => 'array',
            'departure_date' => 'date',
            'is_best_seller' => 'boolean',
            'manifest_locked_at' => 'datetime',
        ];
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function financeRecords()
    {
        return $this->hasMany(FinanceRecord::class, 'package_id');
    }

    public function manifestVersions()
    {
        return $this->hasMany(ManifestVersion::class);
    }

    public function currentManifestVersion()
    {
        return $this->hasOne(ManifestVersion::class)->where('status', 'final')->latestOfMany('version');
    }

    public function manifestLockedBy()
    {
        return $this->belongsTo(User::class, 'manifest_locked_by');
    }
}
