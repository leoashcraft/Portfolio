const mix = require('laravel-mix');

mix.setResourceRoot('https://static.leoashcraft.com')
   .styles([
       'resources/css/fontAwesome5Pro.css',
       'resources/css/cdheadline.css',
       'resources/css/swiper-bundle.min.css',
       'resources/css/style.min.css',
       'resources/css/font.css',
   ], 'public/css/all.css')
   .scripts([
       'resources/js/jquery-3.6.0.min.js',
       'resources/js/waypoints.min.js',
       'resources/js/tw-elements.umd.min.js',
       'resources/js/cd-headline.js',
       'resources/js/jquery.counterup.min.js',
       'resources/js/swiper-bundle.min.js',
       'resources/js/scrollIt.min.js',
       'resources/js/circle-progress.min.js',
       'resources/js/script.js',
       'resources/js/theme-mode.js',
   ], 'public/js/all.js')
   .version();