<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PopupPromo extends Model
{
    protected $fillable = [
        'title',
        'description',
        'image',
        'button_text',
        'button_link',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
