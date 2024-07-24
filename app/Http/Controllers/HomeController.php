<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\ContactFormMail;
use App\Rules\ReCaptcha;

class HomeController extends Controller
{
    public function index()
    {
        return view('index');
    }

    public function send_mail(Request $request)
    {
        Log::info('Inside send_mail.');
        
        try {
            Log::info('Starting validation.');
            $validatedData = $request->validate([
                'fullname' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255'],
                'phone_number' => ['nullable', 'string', 'max:255'],
                'message' => ['required', 'string', 'max:255']
            ]);
            Log::info('Validation passed.', $validatedData);
        } catch (\Exception $e) {
            Log::error('Validation failed: ' . $e->getMessage());
            return redirect()->back()->withErrors(['validation' => 'Validation failed. Please check your input and try again.']);
        }

        try {
            Log::info('Sending email.');
            Mail::to('leo@ashcraft.tech')->send(new ContactFormMail($validatedData));
            Log::info('Mail sent successfully.');
            return redirect()->route('contact')->with('status', 'Your Mail has been received');
        } catch (\Exception $e) {
            Log::error('Mail failed to send: ' . $e->getMessage());
            return redirect()->back()->withErrors(['mail' => 'Mail sending failed. Please try again later.']);
        }
    }
}
