<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Curation extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'image'];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'curation_products')
            ->withPivot('sort_order')
            ->orderBy('curation_products.sort_order');
    }
}
