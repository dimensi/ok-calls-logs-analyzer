import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 3000
  },
  base: process.env.NODE_ENV === 'production' ? '/ok-calls-logs-analyzer/' : '/'
});
