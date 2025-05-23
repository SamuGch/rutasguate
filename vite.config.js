import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  define: {
    'process.env': {}
  },
  optimizeDeps: {
    exclude: ['@rollup/rollup-linux-x64-gnu']  // 👈 importante
  },
  build: {
    target: 'esnext'
  }
});
