import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'toposort',
      'tiny-case', 
      'property-expr',
      'yup' // try including yup instead of excluding
    ],
    esbuildOptions: {
      // Ensure ESbuild handles these packages correctly
      supported: {
        'dynamic-import': true,
        'import-meta': true
      }
    }
  },
  resolve: {
    alias: {
      toposort: resolve(__dirname, 'node_modules/toposort/index.js'),
      'tiny-case': resolve(__dirname, 'node_modules/tiny-case/index.js'),
      'property-expr': resolve(__dirname, 'node_modules/property-expr/index.js')
    }
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // Force CJS/ESM transformation
      include: [/node_modules/] // Apply to all node_modules
    }
  },
   server: {
    port: 80,
  }
})