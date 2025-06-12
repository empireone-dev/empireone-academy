<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GrammarAndSpelling extends Model
{
    protected $fillable = [
        'exam_id',
        'score',
        'answer',
    ];
}
