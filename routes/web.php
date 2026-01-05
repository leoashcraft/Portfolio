<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;

Route::get('', [HomeController::class, 'index'])->name('contact');
Route::post('send-mail', [HomeController::class, 'send_mail'])->name('send.mail')->middleware('recaptcha');

Route::view('dashboard', 'dashboard')
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::view('profile', 'profile')
    ->middleware(['auth'])
    ->name('profile');

require __DIR__.'/auth.php';
