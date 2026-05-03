<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomepageSection extends Model
{
    protected $fillable = ['type', 'title', 'subtitle', 'content', 'sort_order', 'is_active'];

    protected $casts = [
        'content' => 'array',
        'is_active' => 'boolean'
    ];

    public function items()
    {
        return $this->hasMany(HomepageSectionItem::class)->orderBy('sort_order');
    }
}
