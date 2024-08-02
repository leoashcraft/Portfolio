const mix = require('laravel-mix');
const rimraf = require('rimraf');

mix.before(() => {
    rimraf.sync('public/css/all.css');
    rimraf.sync('public/js/all.js');
});

mix.styles([
    'resources/css/cdheadline.css',
    'resources/css/swiper-bundle.min.css',
    'resources/css/style.min.css',
    'resources/css/custom-embedded.css'
], 'public/css/all.css');

mix.scripts([
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
    'resources/js/lazy-video.js'
], 'public/js/all.js');

mix.minify('public/css/all.css')
   .minify('public/js/all.js')
   .version();
