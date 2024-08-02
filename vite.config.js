import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            refresh: true,
        }),
    ],
    resolve: {
        alias: {
            'jquery': 'jquery/dist/jquery.min.js',
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: undefined,
                entryFileNames: 'assets/all.js',
                chunkFileNames: 'assets/all.js',
                assetFileNames: 'assets/all.[ext]',
            },
        },
        minify: 'esbuild',
    },
});
