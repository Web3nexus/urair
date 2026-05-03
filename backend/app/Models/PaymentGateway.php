<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentGateway extends Model
{
    protected $fillable = [
        'provider',
        'public_key',
        'secret_key',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
