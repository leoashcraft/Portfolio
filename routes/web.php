<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;

// Temporary debug route - REMOVE AFTER DEBUGGING
Route::get('/debug-mail', function () {
    $config = [
        'MAIL_MAILER' => config('mail.default'),
        'MAIL_HOST' => config('mail.mailers.smtp.host'),
        'MAIL_PORT' => config('mail.mailers.smtp.port'),
        'MAIL_ENCRYPTION' => config('mail.mailers.smtp.encryption'),
        'MAIL_USERNAME' => config('mail.mailers.smtp.username') ? 'SET' : 'NOT SET',
        'MAIL_PASSWORD' => config('mail.mailers.smtp.password') ? 'SET' : 'NOT SET',
    ];

    // Test socket connection
    $host = config('mail.mailers.smtp.host');
    $port = config('mail.mailers.smtp.port');
    $connection = @fsockopen($host, $port, $errno, $errstr, 10);

    if ($connection) {
        $config['CONNECTION_TEST'] = "SUCCESS - Can reach $host:$port";
        fclose($connection);
    } else {
        $config['CONNECTION_TEST'] = "FAILED - Cannot reach $host:$port - Error: $errstr ($errno)";
    }

    return response()->json($config);
});

Route::get('', [HomeController::class, 'index'])->name('contact');
Route::post('send-mail', [HomeController::class, 'send_mail'])->name('send.mail')->middleware('recaptcha');

Route::view('dashboard', 'dashboard')
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::view('profile', 'profile')
    ->middleware(['auth'])
    ->name('profile');

require __DIR__.'/auth.php';
