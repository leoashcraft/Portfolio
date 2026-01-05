<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Mailtrap\Config;
use Mailtrap\Helper\ResponseHelper;
use Mailtrap\MailtrapClient;
use Mailtrap\Mime\MailtrapEmail;
use Symfony\Component\Mime\Address;

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
            Log::info('Sending email via Mailtrap API.');

            $mailtrap = new MailtrapClient(new Config(config('services.mailtrap.token')));

            $htmlBody = view('emails.contact', ['contact' => $validatedData])->render();

            $email = (new MailtrapEmail())
                ->from(new Address('leo@ashcraft.tech', 'Ashcraft.Tech'))
                ->to(new Address('leo@ashcraft.tech'))
                ->subject('Contact Form Submission')
                ->html($htmlBody)
                ->text(sprintf(
                    "Name: %s\nEmail: %s\nPhone: %s\nMessage: %s",
                    $validatedData['fullname'],
                    $validatedData['email'],
                    $validatedData['phone_number'] ?? 'N/A',
                    $validatedData['message']
                ));

            $response = $mailtrap->sending()->emails()->send($email);

            Log::info('Mail sent successfully.', ['response' => ResponseHelper::toArray($response)]);
            return redirect()->route('contact')->with('status', 'Your Mail has been received');
        } catch (\Exception $e) {
            Log::error('Mail failed to send: ' . $e->getMessage());
            return redirect()->back()->withErrors(['mail' => 'Mail sending failed. Please try again later.']);
        }
    }
}
