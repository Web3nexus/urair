<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FooterLink extends Model
{
    protected $fillable = ['footer_section_id', 'name', 'path', 'sort_order', 'is_active'];

    public function section()
    {
        return $this->belongsTo(FooterSection::class, 'footer_section_id');
    }
}
