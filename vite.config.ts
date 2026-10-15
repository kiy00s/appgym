import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // relative base so GitHub Pages works for any subpath (e.g. username.github.io/repo/)
});
