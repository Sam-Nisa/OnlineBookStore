<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Genre extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'parent_id', 'image']; // add 'image'

    // Self-relation for subgenres
    public function subgenres()
    {
        return $this->hasMany(Genre::class, 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo(Genre::class, 'parent_id');
    }
}
