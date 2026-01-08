// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  site: 'https://ashcraft.tech',
  output: 'static',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    react(),
    mdx(),
    sitemap(),
    compress({
      CSS: true,
      HTML: true,
      JavaScript: true,
      Image: false, // Skip images - already optimized
      SVG: true,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
    },
    optimizeDeps: {
      include: ['detect-gpu'],
      esbuildOptions: {
        target: 'esnext',
      },
    },
    resolve: {
      alias: {
        'detect-gpu': 'detect-gpu/dist/detect-gpu.esm.js',
      },
    },
  },
  image: {
    domains: ['github.com', 'avatars.githubusercontent.com'],
  },
});
