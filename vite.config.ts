import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    __DEV__: 'import.meta.env.DEV',
  },
  esbuild: {
    target: 'es2022',
  },
  build: {
    lib: {
      entry: {
        index:          'src/index.ts',
        alert:          'src/alert/index.ts',
        badge:          'src/badge/index.ts',
        breadcrumb:     'src/breadcrumb/index.ts',
        button:         'src/button/index.ts',
        'button-group': 'src/button-group/index.ts',
        'copy-button':  'src/copy-button/index.ts',
        card:           'src/card/index.ts',
        checkbox:       'src/checkbox/index.ts',
        detail:         'src/detail/index.ts',
        dialog:         'src/dialog/index.ts',
        drawer:         'src/drawer/index.ts',
        divider:        'src/divider/index.ts',
        dropdown:       'src/dropdown/index.ts',
        icon:           'src/icon/index.ts',
        'icon-button':  'src/icon-button/index.ts',
        navbar:         'src/navbar/index.ts',
        'radio-group':  'src/radio-group/index.ts',
        select:         'src/select/index.ts',
        slider:         'src/slider/index.ts',
        switch:         'src/switch/index.ts',
        tabs:           'src/tabs/index.ts',
        tag:            'src/tag/index.ts',
        'text-input':   'src/text-input/index.ts',
        textarea:       'src/textarea/index.ts',
        tooltip:        'src/tooltip/index.ts',
        tree:           'src/tree/index.ts',
        menu:           'src/menu/index.ts',
        'progress-bar': 'src/progress-bar/index.ts',
        pagination:     'src/pagination/index.ts',
        spinner:        'src/spinner/index.ts',
      },
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
