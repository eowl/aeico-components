import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: path.resolve(__dirname, 'example'),
  esbuild: {
    target: 'es2022',
  },
  define: {
    __DEV__: 'true',
    'import.meta.env.DEV': 'true',
  },
  server: {
    port: 3100,
    open: true,
  },
})
