import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  define: {
    __DEV__: 'import.meta.env.DEV',
  },
  esbuild: {
    target: 'es2022',
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'AeicoComponents',
    },
    rollupOptions: {
      external: ['aeico', 'aeico-localize'],
      output: [
        {
          format: 'es',
          exports: 'named',
          entryFileNames: '[name].js',
          chunkFileNames: 'chunks/[name].js',
        },
        {
          format: 'cjs',
          exports: 'named',
          entryFileNames: '[name].cjs',
          chunkFileNames: 'chunks/[name].cjs',
        },
      ],
    },
    sourcemap: true,
    minify: false,
    cssCodeSplit: false,
  },
})
