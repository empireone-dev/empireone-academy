<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypingTest extends Model
{
    protected $fillable = [
        'exam_id',
        'word_per_minute',
        'accuracy',
        'net_word_per_minute',
    ];
}
