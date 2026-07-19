<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'package_id', 'user_id', 'jamaah_member_id', 'status_pembayaran', 'status_dokumen', 'amount_paid', 'is_seat_reduced', 'bukti_pembayaran', 'order_id'
    ];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jamaahMember()
    {
        return $this->belongsTo(JamaahMember::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
    
    protected static function booted()
    {
        static::creating(function ($booking) {
            if ($booking->status_dokumen === 'lengkap') {
                $booking->is_seat_reduced = true;
            }
        });

        static::created(function ($booking) {
            if ($booking->order_id) {
                return;
            }
            if ($booking->is_seat_reduced) {
                $booking->package->decrement('available_seats');
            }
        });

        static::updating(function ($booking) {
            // If status_dokumen becomes 'lengkap', automatically set is_seat_reduced to true
            if ($booking->isDirty('status_dokumen') && $booking->status_dokumen === 'lengkap') {
                $booking->is_seat_reduced = true;
            }

            // Handle seat adjustments based on changes to is_seat_reduced
            if ($booking->isDirty('is_seat_reduced')) {
                if ($booking->order_id) {
                    return;
                }
                if ($booking->is_seat_reduced) {
                    $booking->package->decrement('available_seats');
                } else {
                    $booking->package->increment('available_seats');
                }
            }
        });

        static::deleted(function ($booking) {
            if ($booking->order_id) {
                return;
            }
            if ($booking->is_seat_reduced) {
                $booking->package->increment('available_seats');
            }
        });
    }
}
