<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JamaahMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'imported_by',
        'import_agent_name',
        'import_batch',
        'name',
        'nik',
        'jenis_kelamin',
        'tempat_lahir',
        'tgl_lahir',
        'hubungan_keluarga',
        'paspor_file',
        'paspor_second_file',
        'ktp_file',
        'kk_file',
        'vaksin_file',
        'nomor_paspor',
        'paspor_issued',
        'paspor_expiry',
        'paspor_office',
        'pp',
        'vm',
        'vp',
        'email',
        'nohp',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function importer()
    {
        return $this->belongsTo(User::class, 'imported_by');
    }
}
