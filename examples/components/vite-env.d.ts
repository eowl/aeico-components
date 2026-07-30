/// <reference types="vite/client" />
declare const __DEV__: boolean
declare module '*.css' { const css: string; export default css }
declare module '*.css?inline' { const css: string; export default css }
