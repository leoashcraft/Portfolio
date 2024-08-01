<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Google\Client as GoogleClient;
use Google\Service\Gmail;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\Mime\Email;

class GoogleController extends Controller
{
    protected $googleClient;

    public function __construct()
    {
        $this->googleClient = new GoogleClient();
        $this->googleClient->setClientId(config('google.client_id'));
        $this->googleClient->setClientSecret(config('google.client_secret'));
        $this->googleClient->setRedirectUri(config('google.redirect_uri'));
        $this->googleClient->addScope(Gmail::GMAIL_SEND);
        $this->googleClient->setAccessType('offline');
    }

    public function redirectToGoogle()
    {
        $authUrl = $this->googleClient->createAuthUrl();
        return redirect($authUrl);
    }

    public function handleGoogleCallback(Request $request)
    {
        $code = $request->input('code');

        if (!$code) {
            return redirect()->route('contact')->with('error', 'Authorization code not found.');
        }

        try {
            $this->googleClient->fetchAccessTokenWithAuthCode($code);
            $accessToken = $this->googleClient->getAccessToken();

            if (isset($accessToken['error'])) {
                throw new \Exception($accessToken['error_description']);
            }

            Session::put('google_access_token', $accessToken);

            return redirect()->route('contact')->with('status', 'Google authentication successful. You can now send emails.');
        } catch (\Exception $e) {
            return redirect()->route('contact')->with('error', 'Error during Google authentication: ' . $e->getMessage());
        }
    }

    public function sendEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fullname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone_number' => 'nullable|string|max:255',
            'message' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return redirect(url()->route('contact') . '#contact')
                ->withErrors($validator)
                ->withInput();
        }

        $contact = [
            'fullname' => $request->input('fullname'), 
            'email' => $request->input('email'),
            'phone_number' => $request->input('phone_number'),
            'message' => $request->input('message')
        ];

        $accessToken = Session::get('google_access_token');

        if (!$accessToken) {
            return redirect()->route('auth.google');
        }

        $this->googleClient->setAccessToken($accessToken);

        $gmail = new Gmail($this->googleClient);

        $email = (new Email())
            ->from('leo@ashcraft.tech')
            ->to('leo@ashcraft.tech')
            ->subject('Contact Form Submission')
            ->html(view('emails.contact', ['contact' => $contact])->render());

        $rawMessage = $this->base64UrlEncode($email->toString());

        $message = new \Google\Service\Gmail\Message();
        $message->setRaw($rawMessage);

        try {
            $gmail->users_messages->send('me', $message);
            return redirect(url()->route('contact') . '#contact')
                ->with('status', 'Email sent successfully!');
        } catch (\Exception $e) {
            return redirect(url()->route('contact') . '#contact')
                ->with('error', 'Error sending email: ' . $e->getMessage());
        }
    }

    private function base64UrlEncode($data)
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}
