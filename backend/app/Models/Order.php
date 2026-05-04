<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class Order extends Model
{
    use LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontLogIfAttributesChangedOnly(['updated_at']);
    }
    /**
     * SECURITY: Explicit fillable list prevents mass-assignment attacks.
     * Only these fields can be set via create()/update() with array input.
     */
    protected $fillable = [
        'user_id',
        'total_price',
        'shipping_address',
        'shipping_cost',
        'shipping_details',
        'billing_details',
        'status',
        'payment_method',
        'payment_status',
        'payment_reference',
        'tracking_number',
        'rider_id',
        'notes',
    ];
    
    protected $casts = [
        'shipping_details' => 'array',
        'billing_details' => 'array',
        'total_price' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function rider()
    {
        return $this->belongsTo(User::class, 'rider_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
