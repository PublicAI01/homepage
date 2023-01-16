import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import inject from '@rollup/plugin-inject';
import compressPlugin from 'vite-plugin-compression';
import legacyPlugin from '@vitejs/plugin-legacy';
import path from 'path';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import viteSvgComponentPlugin from './plugins/vite-svg-component/index';

const r = (p) => path.resolve(__dirname, p);

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8000,
    host: true,
  },
  resolve: {
    alias: {
      '@': r('./src'),
      '@c': r('./src/components'),
      process: 'process/browser',
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
      util: 'util',
    },
  },
  plugins: [
    react(),
    viteSvgComponentPlugin({
      include: 'src/assets/imgs/**/*.svg*',
    }),
    compressPlugin({
      verbose: true,
      disable: true,
      deleteOriginFile: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    legacyPlugin({
      targets: ['chrome 52'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
  ],
  build: {
    sourcemap: false,
    rollupOptions: {
      plugins: [
        dynamicImportVars(),
        inject(
          { Buffer: ['buffer', 'Buffer'] },
        ),
      ],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_debugger: true,
        drop_console: true,
      },
    },
  },
  css: {
    postcss: {
      plugins: [postcssImport, autoprefixer, tailwindcss],
    },
    preprocessorOptions: {
      less: {
        additionalData: `@import "${r('./src/assets/styles/comm.less')}";`,
        javascriptEnabled: true,
      },
    },
  },
});
