   @if(session('status'))
    <div class="row justify-content-center">
        <div class="col-xl-8 col-lg-8 col-md-8">
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Success ! </strong>  &nbsp; {{ session('status') }}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
    </div>
    @endif

    <form id="contact-form" method="POST" action="{{ route('send.mail') }}" enctype="multipart/form-data" class="space-y-4">
        @csrf
        <div class="form-group">
            <input type="text" placeholder="Name" class="form-control @error('fullname') is-invalid @enderror w-full p-5 text-sm outline-none h-13 focus:border-theme dark:focus:border-theme dark:placeholder:text-white/40" name="fullname" required autocomplete="Fullname">

            @error('fullname')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
        </div>
        <div class="form-group">
            <input type="email" placeholder="E-Mail" class="form-control @error('email') is-invalid @enderror w-full p-5 text-sm outline-none h-13 focus:border-theme dark:focus:border-theme dark:placeholder:text-white/40" name="email" required autocomplete="email">

            @error('email')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
        </div>
        <div class="form-group">
            <input type="text" placeholder="Phone" class="form-control @error('phone_number') is-invalid @enderror w-full p-5 text-sm outline-none h-13 focus:border-theme dark:focus:border-theme dark:placeholder:text-white/40" name="phone_number" required autocomplete="phone_number">

            @error('phone_number')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
        </div>
        <div class="form-group">
            <textarea placeholder="Message" class="form-control @error('message') is-invalid @enderror w-full px-5 py-4 text-sm outline-none focus:border-theme dark:placeholder:text-white/40" name="message" required></textarea>

            @error('message')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
        </div>
        <div class="form-group">
            <button type="submit" class="inline-flex items-center gap-2 text-[15px] font-medium border border-theme bg-theme text-white py-4.5 px-9 rounded-4xl leading-none transition-all duration-300 hover:bg-themeHover hover:border-themeHove">
                {{ __('Send Message') }}
            </button>
        </div>
        <div class="form-group">
            <input type="hidden" name="recaptcha_token" id="recaptcha_token">
            <p class="text-grey">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.</p>

        </div>
    </form>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('contact-form');
        const submitButton = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form from submitting immediately
            console.log('Form submission prevented.'); // Debugging statement

            submitButton.disabled = true; // Disable submit button to prevent multiple submissions

            grecaptcha.ready(function() {
                grecaptcha.execute('{{ config('services.recaptcha.key') }}', {action: 'submit'}).then(function(token) {
                    console.log('Generated token:', token); // Debugging statement
                    document.getElementById('recaptcha_token').value = token;
                    console.log('Token set in hidden input:', document.getElementById('recaptcha_token').value); // Debugging statement
                    form.submit(); // Submit the form after the token is set
                    console.log('Form submitted.'); // Debugging statement
                }).catch(function(error) {
                    console.error('Error generating token:', error); // Debugging statement
                    submitButton.disabled = false; // Re-enable submit button if token generation fails
                });
            });
        });
    });
</script>
