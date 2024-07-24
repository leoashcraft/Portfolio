<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VerifyReCaptcha
{
    public function handle($request, Closure $next)
    {
        Log::debug('VerifyReCaptcha middleware triggered.');
        
        $recaptchaToken = $request->input('recaptcha_token');
        Log::debug('ReCaptcha token:', ['token' => $recaptchaToken]);

        if (!$recaptchaToken) {
            Log::debug('ReCaptcha token missing.');
            return redirect()->back()->withErrors(['recaptcha' => 'ReCaptcha verification failed.']);
        }

        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => config('services.recaptcha.secret'),
            'response' => $recaptchaToken,
        ]);

        Log::debug('ReCaptcha response:', $response->json());

        if (!$response->json()['success']) {
            Log::error('ReCaptcha verification failed:', ['error-codes' => $response->json()['error-codes']]);
            return redirect()->back()->withErrors(['recaptcha' => 'ReCaptcha verification failed. Please try again.']);
        }

        Log::debug('ReCaptcha verified successfully.');

        return $next($request);
    }
}
