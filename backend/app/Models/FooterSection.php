<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FooterSection extends Model
{
    protected $fillable = ['title', 'sort_order', 'is_active'];

    public function links()
    {
        return $this->hasMany(FooterLink::class)->orderBy('sort_order');
    }
}
