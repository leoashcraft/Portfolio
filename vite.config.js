import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            refresh: true,
        }),
    ],
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
    assetsInclude: ['**/*.eot', '**/*.svg', '**/*.ttf', '**/*.woff', '**/*.woff2'],
});