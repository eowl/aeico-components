/**
 * Build script: compiles public CSS files into JS modules that export the
 * raw CSS string. This lets consumers import them for use in adoptedStyleSheets
 * without depending on Vite's ?raw / ?inline query parameters.
 *
 * Input:   src/styles/layout.css, radius.css, variables.css
 * Output:  dist/styles/*.js + dist/styles/*.cjs + dist/types/styles/*.d.ts
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const jsDir = resolve(rootDir, 'dist', 'styles')
const typesDir = resolve(rootDir, 'dist', 'types', 'styles')

const files = ['layout', 'radius', 'variables']

await mkdir(jsDir, { recursive: true })
await mkdir(typesDir, { recursive: true })

for (const name of files) {
  const cssPath = resolve(rootDir, 'src', 'styles', `${name}.css`)
  const cssText = await readFile(cssPath, 'utf-8')

  // ESM
  const esm = `export default ${JSON.stringify(cssText)}`
  await writeFile(resolve(jsDir, `${name}.js`), esm, 'utf-8')

  // CJS
  const cjs = `module.exports = ${JSON.stringify(cssText)}`
  await writeFile(resolve(jsDir, `${name}.cjs`), cjs, 'utf-8')

  // Type declaration
  const dts = `declare const _default: string\nexport default _default\n`
  await writeFile(resolve(typesDir, `${name}.d.ts`), dts, 'utf-8')
}

console.log('Styles built → dist/styles/* + dist/types/styles/*')
