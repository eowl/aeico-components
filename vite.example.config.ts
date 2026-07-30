import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'

/**
 * Vite plugin: makes CSS imports under `src/styles/` resolve as raw strings.
 *
 * Components import CSS via `import styles from './foo.css'` to feed
 * adoptedStyleSheets. In the dev server Vite normally resolves .css as a
 * stylesheet (injecting into <style>), but we need the raw text.
 *
 * We hook `transform` with enforce: 'post' to intercept CSS modules *after*
 * Vite's built-in CSS plugin. We replace the module with a JS default-export
 * of the raw CSS string.
 *
 * Exceptions: `layout.css` and `radius.css` (side-effect imports in shared.ts)
 * are left alone - they should be injected as normal stylesheets.
 */
function cssStringPlugin() {
  const RAW_CSS_PATTERN = /\/src\/styles\/(variables|size|color|components\/)/
  const SKIP_PATTERN = /\/src\/styles\/(layout|radius)\.css$/

  return {
    name: 'css-string',
    enforce: 'post' as const,
    transform(code: string, id: string) {
      // Only handle .css files, skip layout.css and radius.css
      if (!id.endsWith('.css')) return
      if (SKIP_PATTERN.test(id)) return
      if (!RAW_CSS_PATTERN.test(id)) return

      // Vite's CSS plugin has already processed this - `code` is the
      // transformed JS module. We replace it with a simple default export.
      const cssText = fs.readFileSync(id, 'utf-8')
      return {
        code: `export default ${JSON.stringify(cssText)}`,
        map: null,
      }
    },
  }
}

export default defineConfig({
  root: path.resolve(__dirname, 'examples', 'components'),
  esbuild: {
    target: 'es2022',
  },
  define: {
    'import.meta.env.DEV': 'true',
  },
  server: {
    port: 3100,
    open: true,
  },
  plugins: [cssStringPlugin()],
})
