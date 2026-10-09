/**
 * esbuild build script for ESM output.
 *
 * Replaces the Vite library build. Produces:
 *   dist/*.js          - entry points
 *   dist/*.js.map      - source maps
 *   dist/chunks/*.js   - shared chunks
 */

import * as esbuild from 'esbuild'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cssInline } from './lib/esbuild.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

/** @type {Record<string, string>} - same entries as the old Vite config */
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
  'built-in-icons': 'src/icon/built-in-icons.ts',
  image:          'src/image/index.ts',
  'icon-button':  'src/icon-button/index.ts',
  list:           'src/list/index.ts',
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

const watch = process.argv.includes('--watch')

const buildOptions = {
  entryPoints,
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  outdir: 'dist',
  outbase: 'src',
  entryNames: '[name]',
  chunkNames: 'chunks/[name]',
  external: ['aeico', 'aeico-localize'],
  define: {
    __DEV__: String(watch),
  },
  sourcemap: true,
  minify: false,
  plugins: [cssInline()],
  absWorkingDir: rootDir,
}

if (watch) {
  const ctx = await esbuild.context(buildOptions)
  await ctx.watch()
  console.log('ESM watch mode - rebuilding on changes...')
} else {
  await esbuild.build(buildOptions)
  console.log('ESM build done to dist/*.js')
}
