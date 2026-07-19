<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JamaahProfile extends Model
{
    protected $fillable = [
        'user_id', 'no_wa', 'tempat_lahir', 'tgl_lahir', 'alamat', 
        'paspor_file', 'ktp_file', 'kk_file', 'vaksin_file'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
