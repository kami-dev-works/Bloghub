import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  site: process.env.SITE_URL || 'https://bloghub.example.com',
  integrations: [react()],
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  security: {
    checkOrigin: false,
  },
  build: {
    format: 'file',
    assets: 'assets',
  },
  vite: {
    optimizeDeps: {
      include: [
        'react-dom',
        'react-dom/client',
        'react-dom/server',
        'react-router-dom',
        'react-helmet-async',
        '@mui/material',
        '@mui/icons-material',
      ],
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://api.subhkarta.net',
          changeOrigin: true,
        },
        '/uploads': {
          target: 'https://api.subhkarta.net',
          changeOrigin: true,
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/@mui/') || id.includes('node_modules/@emotion/') || id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router/') || id.includes('node_modules/react-helmet') || id.includes('node_modules/scheduler/') || id.includes('node_modules/prop-types') || id.includes('node_modules/hoist-non-react-statics') || id.includes('node_modules/use-sync-external-store') || id.includes('node_modules/stylis')) {
              return 'vendor';
            }
            if (id.includes('CKEditorWrapper') || id.includes('ckeditor5')) {
              return 'ckeditor-chunk';
            }
            if (id.includes('Admin.jsx') || id.includes('BlogImageUpload') || id.includes('Customization.jsx') || id.includes('SliderManager.jsx')) {
              return 'admin-chunk';
            }
          },
        },
      },
    },
  },
  compressHTML: true,
});
