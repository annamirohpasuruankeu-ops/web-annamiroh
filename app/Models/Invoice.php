<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'invoice_code',
        'agent_id',
        'package_id',
        'order_text',
        'grand_total',
        'keterangan',
        'items',
        'discounts',
        'raw_agent_name',
        'raw_departure_date_package',
    ];

    protected $casts = [
        'grand_total' => 'decimal:2',
        'items' => 'array',
        'discounts' => 'array',
    ];

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function package()
    {
        return $this->belongsTo(Package::class, 'package_id');
    }
}
