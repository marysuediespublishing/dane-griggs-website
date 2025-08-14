import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import { readingTimeRemarkPlugin } from './src/utils/reading-time.mjs';

export default defineConfig({
  site: 'https://danegriggs.com',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    mdx(),
    sitemap()
  ],
  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    shikiConfig: {
      theme: 'dark-plus',
      wrap: true
    }
  },
  vite: {
    define: {
      __DATE__: `'${new Date().toISOString()}'`,
    }
  }
});
