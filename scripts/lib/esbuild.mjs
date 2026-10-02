/**
 * esbuild adapter for the CSS-inline transform.
 *
 * Makes `import styles from './foo.css'` resolve to the raw CSS text, so it can
 * be handed to `static styles` / `adoptedStyleSheets`. This replaces Vite's
 * `?inline` query parameter, keeping the library build bundler-agnostic.
 *
 * @example
 * ```js
 * import { cssInline } from './lib/esbuild.mjs'
 * await esbuild.build({ plugins: [cssInline()] })                  // ESM
 * await esbuild.build({ plugins: [cssInline({ format: 'cjs' })] }) // CJS
 * ```
 */

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { cssToModule } from './css-module.mjs'

/**
 * @param {{ format?: 'esm' | 'cjs' }} [options]
 * @returns {import('esbuild').Plugin}
 */
export function cssInline({ format = 'esm' } = {}) {
  return {
    name: 'css-inline',
    setup(build) {
      // Intercept .css files that are loaded via import/require
      build.onResolve({ filter: /\.css$/ }, (args) => {
        return {
          path: resolve(args.resolveDir, args.path),
          namespace: 'css-inline',
        }
      })

      build.onLoad({ filter: /.*/, namespace: 'css-inline' }, async (args) => {
        const cssText = await readFile(args.path, 'utf-8')
        return {
          contents: cssToModule(cssText, { format }),
          loader: 'js',
        }
      })
    },
  }
}
