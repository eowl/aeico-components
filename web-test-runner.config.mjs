import { playwrightLauncher } from '@web/test-runner-playwright'
import { esbuildPlugin } from '@web/dev-server-esbuild'
import { cssInlinePlugin } from './test/plugins/cssInline-plugin.mjs'
import { buildTestRunnerHtml } from './test/helpers/test-runner-html.mjs'

const TIMEOUT_MS = 3000

export default {
  files: 'test/specs/**/*.test.ts',
  nodeResolve: true,
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
  ],
  plugins: [
    cssInlinePlugin(),
    esbuildPlugin({ ts: true, target: 'es2022', define: { 'import.meta.env.DEV': 'false' } }),
  ],
  testFramework: {
    config: {
      timeout: TIMEOUT_MS,
    },
  },
  testRunnerHtml: (testRunnerImport) => buildTestRunnerHtml(testRunnerImport, TIMEOUT_MS),
}
