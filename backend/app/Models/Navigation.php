<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Navigation extends Model
{
    protected $fillable = ['name', 'slug'];

    public function items()
    {
        return $this->hasMany(NavigationItem::class)->whereNull('parent_id')->orderBy('sort_order');
    }

    public function allItems()
    {
        return $this->hasMany(NavigationItem::class)->orderBy('sort_order');
    }
}
