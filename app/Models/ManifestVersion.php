<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManifestVersion extends Model
{
    protected $fillable = [
        'package_id', 'version', 'status', 'snapshot', 'jamaah_count',
        'finalized_by', 'finalized_at', 'invalidated_by', 'invalidated_at',
        'invalidation_reason',
    ];

    protected function casts(): array
    {
        return [
            'snapshot' => 'array',
            'finalized_at' => 'datetime',
            'invalidated_at' => 'datetime',
        ];
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function finalizedBy()
    {
        return $this->belongsTo(User::class, 'finalized_by');
    }

    public function invalidatedBy()
    {
        return $this->belongsTo(User::class, 'invalidated_by');
    }
}
