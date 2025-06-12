<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Exam extends Model
{
    protected $fillable = [
        'name',
        'employee_id',
        'start_time',
        'end_time',
        'total_score',
        'status',
    ];
     public function grammar_and_spellings(): HasMany
    {
        return $this->hasMany(GrammarAndSpelling::class,'exam_id','id');
    }
     public function scenarios(): HasMany
    {
        return $this->hasMany(Scenario::class,'exam_id','id');
    }
     public function typing_test(): HasOne
    {
        return $this->hasOne(TypingTest::class,'exam_id','id');
    }
}
