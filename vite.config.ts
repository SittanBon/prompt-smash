import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base keeps every asset path portable for a future GitHub Pages
// deployment under a repository sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
});
