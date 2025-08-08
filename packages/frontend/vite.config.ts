/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { lingui } from '@lingui/vite-plugin';
import path from 'path';

export default defineConfig({
  root: __dirname,
  cacheDir: '../node_modules/.vitest',

  server: {
    port: 4200,
    host: 'localhost',
  },

  plugins: [
    react({
      babel: {
        plugins: ['macros'],
      },
    }),
    lingui({
      configPath: path.resolve(__dirname, 'lingui.config.ts'),
    }),
    nxViteTsPaths(),
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  define: {
    global: 'globalThis',
    'process.env': {},
  },

  test: {
    globals: true,
    cache: {
      dir: '../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
