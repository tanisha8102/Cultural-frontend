import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Change this if you want a different port
  },
  resolve: {
    alias: {
      '@': '/src', // Optional: Allows you to use '@' for absolute imports
    },
  },
});
