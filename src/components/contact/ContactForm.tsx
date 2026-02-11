import { useState, useEffect, useRef, type FormEvent } from 'react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface Props {
  recaptchaSiteKey?: string;
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default function ContactForm({ recaptchaSiteKey }: Props) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const scriptLoadedRef = useRef(false);

  // Lazy-load reCAPTCHA v3 script when component mounts (already visible due to client:visible)
  useEffect(() => {
    if (!recaptchaSiteKey || scriptLoadedRef.current) return;

    // Check if script already exists
    if (document.querySelector('script[src*="recaptcha"]')) {
      scriptLoadedRef.current = true;
      setRecaptchaLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
      setRecaptchaLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // Don't remove script on cleanup - it may be needed if user navigates back
    };
  }, [recaptchaSiteKey]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Get reCAPTCHA token if available
    let recaptchaToken: string | undefined;
    if (recaptchaSiteKey && recaptchaLoaded && window.grecaptcha) {
      try {
        await new Promise<void>((resolve) => window.grecaptcha.ready(resolve));
        recaptchaToken = await window.grecaptcha.execute(recaptchaSiteKey, { action: 'contact' });
      } catch (err) {
        console.error('reCAPTCHA execution failed:', err);
        // Continue without token - backend will handle gracefully
      }
    }

    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      recaptchaToken,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        form.reset();
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Name <span className="text-neon-pink">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          maxLength={100}
          className="w-full px-4 py-3 bg-night-700 border border-night-600 rounded-xl text-white placeholder-gray-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
          placeholder="John Doe"
        />
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Email <span className="text-neon-pink">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          maxLength={100}
          className="w-full px-4 py-3 bg-night-700 border border-night-600 rounded-xl text-white placeholder-gray-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
          placeholder="john@example.com"
        />
      </div>

      {/* Subject Field */}
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Subject <span className="text-neon-pink">*</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          maxLength={200}
          className="w-full px-4 py-3 bg-night-700 border border-night-600 rounded-xl text-white placeholder-gray-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors"
          placeholder="Project inquiry"
        />
      </div>

      {/* Message Field */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Message <span className="text-neon-pink">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={5000}
          className="w-full px-4 py-3 bg-night-700 border border-night-600 rounded-xl text-white placeholder-gray-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-colors resize-none contact-message-input"
          placeholder="Tell me about your project..."
        />
      </div>

      {/* Error Message */}
      {status === 'error' && (
        <div
          className="p-4 rounded-xl text-sm bg-red-500/10 border border-red-500/30 text-red-400"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      {/* Success Message */}
      {status === 'success' && (
        <div
          className="p-4 rounded-xl text-sm bg-neon-green/10 border border-neon-green/30 text-neon-green"
          role="status"
        >
          Thanks for reaching out! I'll get back to you soon.
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? (
          <>
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending...
          </>
        ) : (
          <>
            Send Message
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
