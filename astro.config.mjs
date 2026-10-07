import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { readingTimeRemarkPlugin } from './src/utils/reading-time.mjs';

// In `astro dev`, serve public/admin/index.html at /admin/ (GitHub Pages does this itself).
// Don't add a src/pages/admin route: its build output overwrites the CMS page.
const adminIndex = {
  name: 'admin-index',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === '/admin' || req.url === '/admin/') req.url = '/admin/index.html';
      next();
    });
  },
};

export default defineConfig({
  site: 'https://danegriggs.com',
  output: 'static',
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
    plugins: [adminIndex],
    define: {
      __DATE__: `'${new Date().toISOString()}'`,
    },
    build: {
      sourcemap: false
    }
  }
});
