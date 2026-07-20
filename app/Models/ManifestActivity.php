<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManifestActivity extends Model
{
    protected $fillable = [
        'package_id', 'manifest_version_id', 'user_id', 'action',
        'reason', 'file_name', 'metadata',
    ];

    protected function casts(): array
    {
        return ['metadata' => 'array'];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function version()
    {
        return $this->belongsTo(ManifestVersion::class, 'manifest_version_id');
    }
}
