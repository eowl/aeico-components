/**
 * esbuild build script for CJS output.
 *
 * Produces:
 *   dist/*.cjs          - entry points
 *   dist/*.cjs.map      - source maps
 *   dist/chunks/*.cjs   - shared chunks
 */

import * as esbuild from 'esbuild'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

const entryPoints = {
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
  'detail-group': 'src/detail-group/index.ts',
  dialog:         'src/dialog/index.ts',
  drawer:         'src/drawer/index.ts',
  divider:        'src/divider/index.ts',
  dropdown:       'src/dropdown/index.ts',
  icon:           'src/icon/index.ts',
  'icon-button':  'src/icon-button/index.ts',
  navbar:         'src/navbar/index.ts',
  'number-input': 'src/number-input/index.ts',
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
}

function cssInlinePlugin() {
  return {
    name: 'css-inline',
    setup(build) {
      build.onResolve({ filter: /\.css$/ }, (args) => {
        return {
          path: resolve(args.resolveDir, args.path),
          namespace: 'css-inline',
        }
      })

      build.onLoad({ filter: /.*/, namespace: 'css-inline' }, async (args) => {
        const cssText = await readFile(args.path, 'utf-8')
        return {
          contents: `module.exports = ${JSON.stringify(cssText)}`,
          loader: 'js',
        }
      })
    },
  }
}

await esbuild.build({
  entryPoints,
  bundle: true,
  format: 'cjs',
  platform: 'node',
  target: 'es2022',
  outdir: 'dist',
  outbase: 'src',
  entryNames: '[name]',
  chunkNames: 'chunks/[name]',
  outExtension: { '.js': '.cjs' },
  external: ['aeico', 'aeico-localize'],
  define: {
    __DEV__: 'false',
  },
  sourcemap: true,
  minify: false,
  plugins: [cssInlinePlugin()],
  absWorkingDir: rootDir,
})

console.log('CJS build done to dist/*.cjs')
