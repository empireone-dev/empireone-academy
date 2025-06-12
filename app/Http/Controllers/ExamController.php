<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\GrammarAndSpelling;
use App\Models\Scenario;
use App\Models\TypingTest;
use Illuminate\Http\Request;

class ExamController extends Controller
{

    public function index()
    {
        $exams = Exam::with(['grammar_and_spellings','typing_test','scenarios'])->orderBy('id', 'desc')->paginate();
        return response()->json($exams, 200);
    }
    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required|string|max:255',
            'grammar_and_spelling' => 'required|array',
            'grammar_and_spelling.*.score' => 'required|numeric',
            'grammar_and_spelling.*.userAnswer' => 'required|string',
            'scenario' => 'required|array',
            'scenario.*.score' => 'required|numeric',
            'scenario.*.answer' => 'required|string',
            'typing_test.word_per_minute' => 'required|numeric',
            'typing_test.accuracy' => 'required|numeric',
            'typing_test.net_word_per_minute' => 'required|numeric',
        ]);

        $exam = Exam::create([
            'name' => $request->name,
            // 'employee_id' => null,
            // 'start_time' => $request->name,
            // 'end_time' => $request->name,
            // 'total_score' => $request->name,
            // 'status' => $request->name,
        ]);

        foreach ($request->grammar_and_spelling as $key => $value) {
            GrammarAndSpelling::create([
                'exam_id' => $exam->id,
                'score' => $value['score'],
                'answer' => $value['userAnswer'],
            ]);
        }

        foreach ($request->scenario as $key => $value) {
            Scenario::create([
                'exam_id' => $exam->id,
                'score' => $value['score'],
                'answer' => $value['answer'],
            ]);
        }

        TypingTest::create([
            'exam_id' => $exam->id,
            'word_per_minute' => $request->typing_test['word_per_minute'],
            'accuracy' => $request->typing_test['accuracy'],
            'net_word_per_minute' => $request->typing_test['net_word_per_minute'],
        ]);


        return 'success';
    }
}
