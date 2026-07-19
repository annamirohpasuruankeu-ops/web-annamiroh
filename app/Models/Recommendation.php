<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recommendation extends Model
{
    protected $fillable = [
        'agent_id',
        'jamaah_member_id',
        'nomor_paspor',
        'nama_paspor',
        'keterangan',
        'keterangan_admin',
        'paspor_file',
        'status',
    ];

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function jamaahMember()
    {
        return $this->belongsTo(JamaahMember::class, 'jamaah_member_id');
    }
}
