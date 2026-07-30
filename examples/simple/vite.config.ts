import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

/**
 * Vite plugin: 将 src/styles/ 下的 CSS 导入解析为原始字符串，
 * 供组件的 adoptedStyleSheets 使用。
 */
function cssStringPlugin() {
  const RAW_CSS_PATTERN = /\/src\/styles\/(variables|size|color|components\/)/;
  const SKIP_PATTERN = /\/src\/styles\/(layout|radius)\.css$/;

  return {
    name: 'css-string',
    enforce: 'post' as const,
    transform(code: string, id: string) {
      if (!id.endsWith('.css')) return;
      if (SKIP_PATTERN.test(id)) return;
      if (!RAW_CSS_PATTERN.test(id)) return;

      const cssText = fs.readFileSync(id, 'utf-8');
      return {
        code: `export default ${JSON.stringify(cssText)}`,
        map: null,
      };
    },
  };
}

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      'aeico-components': path.resolve(__dirname, '..'),
    },
  },
  esbuild: {
    target: 'es2022',
  },
  define: {
    'import.meta.env.DEV': 'true',
  },
  server: {
    port: 3200,
    open: true,
  },
  plugins: [cssStringPlugin()],
});
