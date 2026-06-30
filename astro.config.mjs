import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// Default output stays static: marketing pages are prerendered for SEO/CDN.
// Blog routes opt into on-demand SSR (`export const prerender = false`) so they
// render fresh HTML from the backend content API on each request.

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'middleware'
  })
});