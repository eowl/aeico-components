/**
 * Core of the CSS-inline transform: turns the text of a `.css` file into the
 * source of a JS module whose default export is that text.
 *
 * This is intentionally free of any bundler dependency so the same logic can
 * back the esbuild, Vite and test-runner adapters, and later move into an
 * `aeico-build` package unchanged.
 *
 * Convention (keep in sync with aeico-pages):
 *   - adapter export name: `cssInline`
 *   - plugin name:         `'css-inline'`
 *   - match rule:          /\.css$/ (no path restriction)
 *   - module output:       esm -> `export default "<text>"`
 *                          cjs -> `module.exports = "<text>"`
 */

/**
 * @param {string} cssText Raw contents of the CSS file.
 * @param {{ format?: 'esm' | 'cjs' }} [options]
 * @returns {string} Source of a JS module exporting `cssText`.
 */
export function cssToModule(cssText, { format = 'esm' } = {}) {
  const literal = JSON.stringify(cssText)

  return format === 'cjs' ? `module.exports = ${literal}` : `export default ${literal}`
}
