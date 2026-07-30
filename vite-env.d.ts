/// <reference types="vite/client" />

declare const __DEV__: boolean

// CSS module types - .css imports resolve to strings (CSS text).
// Used by example dev server (Vite) and test runner (WTR).
declare module '*.css' {
  const content: string
  export default content
}
