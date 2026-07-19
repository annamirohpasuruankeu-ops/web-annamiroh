<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'package_id', 'agent_id', 'user_id', 'total_pax', 'keterangan', 'status_kunci'
    ];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function groupUser()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    protected static function booted()
    {
        static::creating(function ($order) {
            // Decrement available seats in package when order is created
            if ($order->package) {
                $order->package->decrement('available_seats', $order->total_pax);
            }
        });

        static::updating(function ($order) {
            // Adjust available seats in package if total_pax changes
            if ($order->isDirty('total_pax') && $order->package) {
                $diff = $order->total_pax - $order->getOriginal('total_pax');
                $order->package->decrement('available_seats', $diff);
            }
        });

        static::deleted(function ($order) {
            // Increment/restore available seats in package when order is deleted
            if ($order->package) {
                $order->package->increment('available_seats', $order->total_pax);
            }
        });
    }
}
