import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/admin/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.API_URL,
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
});
