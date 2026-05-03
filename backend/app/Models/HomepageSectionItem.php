<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomepageSectionItem extends Model
{
    protected $fillable = ['homepage_section_id', 'title', 'subtitle', 'image', 'link', 'product_id', 'sort_order', 'is_active'];

    public function section()
    {
        return $this->belongsTo(HomepageSection::class, 'homepage_section_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
