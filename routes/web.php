<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('index/page');
})->name('login');


// Route::middleware('auth:sanctum')->prefix('administrator')->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('administrator/page');
//     });
// });

Route::prefix('administrator')->middleware('auth')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('administrator/dashboard/page');
    })->name('dashboard');

    Route::get('applicants', function () {
        return Inertia::render('administrator/applicants/page');
    })->name('applicants');
});


Route::prefix('auth')->group(function () {
    Route::get('login', function () {
        return Inertia::render('auth/login/page');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
