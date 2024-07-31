<!DOCTYPE html>
<html lang="en" class="">

<head>
    <!-- Basic Page Needs
    ================================================== -->
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <!-- Specific Meta
    ================================================== -->
    <meta name="viewport" 
        content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <meta name="keyword"
        content="leo ashcraft, resume, portfolio, software, web, designer, developer, php, javascript, sql">
    <meta name="description" 
        content="Leo Ashcraft - Full Stack Software Developer specializing in clean, shippable PHP, JavaScript and SQL code for all of your digital ambitions.">
    <meta name="author" 
        content="Leo Ashcraft">

    <!-- Site Title
    ================================================== -->
    <title>Leo Ashcraft - Software Developer</title>

    <!-- Site Favicon
    ================================================== -->
    <link rel="apple-touch-icon" sizes="180x180" href="{{ config('app.static_url') }}/icons/apple-touch-icon.png?v=1">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ config('app.static_url') }}/icons/favicon-32x32.png?v=1">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ config('app.static_url') }}/icons/favicon-16x16.png?v=1">
    <link rel="manifest" href="{{ config('app.static_url') }}/icons/site.webmanifest?v=1">
    <link rel="mask-icon" href="{{ config('app.static_url') }}/icons/safari-pinned-tab.svg?v=1" color="#222222">
    <link rel="shortcut icon" href="{{ config('app.static_url') }}/icons/favicon.ico?v=1">
    <meta name="msapplication-TileColor" content="#222222">
    <meta name="msapplication-config" content="{{ config('app.static_url') }}/icons/browserconfig.xml?v=1">
    <meta name="theme-color" content="#222222">

    <!-- Google Fonts
    ================================================== -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap" rel="stylesheet">


    <!-- All CSS Here
    ================================================== -->
    <link rel="stylesheet" href="{{ config('app.static_url') }}/css/all.css">

</head>

<body class="relative custom_cursor">
    <!-- Theme Toggle Start -->
    <div id="theme-toggle-con" class=".w-12 h-12  mt-2 mr-2 border rounded-full bg-white dark:bg-nightBlack border-platinum dark:border-greyBlack flex-center">
        <div class="flex justify-start">
            <button class="px-4 text-black rounded-md flex items-center" id="theme-toggle" title="Toggle Theme">
                <i id="theme-icon"></i>
            </button>
        </div>
    </div>
    <!-- Custom Cursor Start -->
    <div
        class="custom_cursor_one fixed top-0 left-0 w-8 h-8 border border-gray-400 rounded-full pointer-events-none">
    </div>
    <div
        class="custom_cursor_two w-1 h-1 rounded-full border border-gray-400 bg-metborder-gray-400 fixed pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
    </div>
    <!-- Custom Cursor End -->


    <!-- App Preloader Start -->
    <div id="preloader">
        <div class="loader_line"></div>
        <div
            class="absolute w-20 h-20 transition-all -translate-x-1/2 -translate-y-1/2 logo top-1/2 left-1/2 flex-center">
            <img src="{{ config('app.static_url') }}/img/intro-selfie.webp" alt="Leo">
        </div>
    </div>
    <!-- App Preloader End -->


    <!-- App Start -->
    <div class="relative pt-10 minfo__app max-xl:pt-20">
        <div
            class="menu-overlay fixed top-0 left-0 w-full h-full bg-black/60 transition-all duration-200 z-999 opacity-0 invisible [&.is-menu-open]:visible [&.is-menu-open]:opacity-100">
        </div>
        <div class="max-lg:px-4">

@include('layouts._menu_mobile')
@include('layouts._sidebar_profile')
@include('layouts._menu_desktop')

@yield('content')

        </div>

@include('layouts._footer')

    </div>
    <!-- App End -->

    <!-- Style Switcher Started
    <div class="style-switcher fixed right-0 top-1/2 -translate-y-1/2 translate-x-[15rem] w-[15rem] [&.active]:translate-x-0 transition z-[9999]">

        <div class="toggle-btn absolute -left-15 w-15 h-15 bg-white dark:bg-nightBlack text-black dark:text-white flex-center cursor-pointer rounded-[.5rem_0_0_.5rem] select-none shadow-sm shadow-slate-400">
            <span class="fal fa-cog fa-spin"></span>
        </div>

        <div class="theme-select shadow-sm shadow-slate-400 px-6 py-4 bg-white dark:bg-nightBlack rounded-[0_0_0_.5rem]">
            <h5 class="font-medium mb-2 !text-black dark:!text-white text-lg">Theme Mode</h5>

            <div class="flex items-center justify-between gap-4">
                <div class="switcher-input rounded-lg text-xl flex-[1] text-center transition cursor-pointer" data-theme="dark">
                    <button class="border w-full px-4 py-4 flex flex-col gap-1 justify-center items-center [&.active]:bg-flashWhite [&.active]:text-black dark:text-white rounded-md" id="dark_theme" title="Active Dark Theme">
                        <i class="fal fa-moon"></i>
                    </button>
                </div>
                <div class="switcher-input rounded-lg text-lg flex-[1] text-center transition cursor-pointer" data-theme="light">
                    <button class="border w-full px-4 py-4 flex flex-col gap-1 justify-center items-center [&.active]:bg-flashWhite [&.active]:text-black dark:text-white rounded-md" id="light_theme" title="Active Light Theme">
                        <i class="fal fa-sun"></i>
                    </button>
                </div>
            </div>
        </div>

    </div>
    Style Switcher End -->

    <!-- Js Library Start -->
    <script src="{{ config('app.static_url') }}/js/all.js"></script>
    <script src="https://www.google.com/recaptcha/api.js?render={{ config('services.recaptcha.key') }}" defer></script>
    <!-- Js Library End -->
</body>

</html>