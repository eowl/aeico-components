import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../../')

/**
 * WTR dev-server plugin that handles Vite's `?inline` CSS imports.
 *
 * Vite resolves `import styles from './foo.css?inline'` to a plain string at
 * build time. WTR's dev server knows nothing about this query parameter, so
 * requests for `*.css?inline` would 404.
 *
 * This plugin intercepts those requests and returns a synthetic ES module:
 *   export default "<raw CSS text>"
 */
export function cssInlinePlugin() {
  return {
    name: 'css-inline',

    async serve(context) {
      const url = context.request.url

      // Match any request that looks like a CSS file with the ?inline query
      if (!url.includes('.css?inline')) return

      // Strip query string to get the actual file path
      const filePath = url.split('?')[0]

      // Resolve to an absolute filesystem path
      const absPath = path.join(rootDir, filePath)

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
