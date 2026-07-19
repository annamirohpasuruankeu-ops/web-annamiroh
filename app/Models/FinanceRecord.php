<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FinanceRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'agent_id',
        'package_id',
        'transaction_date',
        'category_bank',
        'amount',
        'type',
        'proof_link',
        'raw_agent_name',
        'raw_departure_date_package',
    ];

    protected function casts(): array
    {
        return [
            'transaction_date' => 'date',
            'amount' => 'decimal:2',
        ];
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function package()
    {
        return $this->belongsTo(Package::class, 'package_id');
    }
}
