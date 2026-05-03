<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Product extends Model
{
    use LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontLogIfAttributesChangedOnly(['updated_at']);
    }
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'images'                  => 'array',
        'tags'                    => 'array',
        'colors'                  => 'array',
        'sizes'                   => 'array',
        'specifications'          => 'array',
        'price'                   => 'decimal:2',
        'old_price'               => 'decimal:2',
        'rating'                  => 'decimal:2',
        'is_featured'             => 'boolean',
        'backorder_available_date' => 'date:Y-m-d',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function collection()
    {
        return $this->belongsTo(Collection::class);
    }

    public function galleryImages()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function curations()
    {
        return $this->belongsToMany(Curation::class);
    }

    public function reviews()
    {
        return $this->hasMany(ProductReview::class)->orderBy('created_at', 'desc');
    }

    public function approvedReviews()
    {
        return $this->hasMany(ProductReview::class)->where('status', 'approved')->orderBy('created_at', 'desc');
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }
}
