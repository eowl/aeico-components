/**
 * @web/test-runner dev-server adapter for the CSS-inline transform.
 *
 * Components import CSS files directly (`import styles from './foo.css'`).
 * WTR's dev server does not know how to serve those as JS modules, so this
 * plugin intercepts `.css` requests and answers with a synthetic ES module.
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { cssToModule } from './css-module.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')

export function cssInline() {
  return {
    name: 'css-inline',

    async serve(context) {
      const url = context.request.url

      // Match requests for .css files (not via import assertions, just plain imports)
      if (!url.endsWith('.css')) return

      // Resolve to an absolute filesystem path
      const absPath = path.join(rootDir, url)

      try {
        const cssText = await readFile(absPath, 'utf-8')
        return {
          body: cssToModule(cssText),
          type: 'application/javascript',
        }
      } catch {
        // File not found - let WTR produce its own 404
        return
      }
    },
  }
}
