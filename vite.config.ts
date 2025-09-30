import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  base: '/ok-calls-logs-analyzer/',
  server: {
    port: 3000,
  },
});
