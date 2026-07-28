import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../../')

/**
 * WTR dev-server plugin that handles CSS imports as raw strings.
 *
 * Components import CSS files directly (e.g. `import styles from './foo.css'`).
 * WTR's dev server doesn't know how to serve these as JS modules, so this
 * plugin intercepts .css requests and returns a synthetic ES module:
 *   export default "<raw CSS text>"
 */
export function cssInlinePlugin() {
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
          body: `export default ${JSON.stringify(cssText)}`,
          type: 'application/javascript',
        }
      } catch {
        // File not found — let WTR produce its own 404
        return
      }
    },
  }
}
