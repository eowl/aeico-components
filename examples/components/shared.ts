import {
  TextInput,
  NumberInput,
  Select,
  Slider,
  Checkbox,
  RadioGroup,
  Icon,
  IconRegistry,
  Switch,
  Tabs,
  Tab,
  TabPanel,
  Dialog,
  Drawer,
  Divider,
  Card,
  Image,
  Badge,
  Tag,
  Breadcrumb,
  BreadcrumbItem,
  Navbar,
  Dropdown,
  DropdownItem,
  Detail,
  ProgressBar,
  Textarea,
  Menu,
  MenuItem,
  Pagination,
  Tree,
  TreeItem,
  List,
  ListItem,
  CopyButton,
} from '../../src/index'
import '../../src/styles/layout.css'
import '../../src/styles/radius.css'
import '../../src/icon/built-in-icons'
void [TextInput, NumberInput, Select, Slider, Checkbox, RadioGroup, Icon, Switch, Tabs, Tab, TabPanel, Dialog, Drawer, Divider, Card, Image, Badge, Tag, Breadcrumb, BreadcrumbItem, Navbar, Dropdown, DropdownItem, Detail, ProgressBar, Textarea, Menu, MenuItem, Pagination, Tree, TreeItem, CopyButton, List, ListItem]

// --- Localization setup ---

type LocaleMessages = {
  resetTitle: string
  clearTitle: string
  closeText: string
}

const LOCALES: Record<string, LocaleMessages> = {
  en: {
    resetTitle: 'Reset',
    clearTitle: 'Clear',
    closeText: 'Close alert',
  },
  zh: {
    resetTitle: '重置',
    clearTitle: '清除',
    closeText: '关闭提示',
  },
}

const SUPPORTED_LANGS = ['en', 'zh'] as const
type SupportedLang = typeof SUPPORTED_LANGS[number]

function detectLang(): SupportedLang {
  const sysLang = navigator.language || ''
  if (sysLang.startsWith('zh')) return 'zh'
  return 'en'
}

let currentLang = detectLang()

// Expose for shell iframe sync
;(window as any).__aeicoLang = currentLang

// Apply locale text to all field components
function applyLocaleToFields(messages: LocaleMessages) {
  document.querySelectorAll<any>('ae-text-input, ae-number-input, ae-textarea, ae-select, ae-slider, ae-checkbox, ae-radio-group').forEach(el => {
    if (el.resettable) el.resetTitle = messages.resetTitle
    if (el.clearable) el.clearTitle = messages.clearTitle
  })
  document.querySelectorAll<any>('ae-alert[dismissible]').forEach(el => {
    el.closeText = messages.closeText
  })
}

applyLocaleToFields(LOCALES[currentLang])


// Register icons
IconRegistry.add({
  'home':    'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
  'check':   'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  'close':   'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  'info':    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
  'warning': 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
  'star':    'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  'settings':'M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z',
  'heart':   'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  'chevron-right':  'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
  'chevron-left':   'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z',
  'chevron-down':   'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z',
  'chevron-up':     'M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z',
  'chevrons-left':  'M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z',
  'chevrons-right': 'M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z',
  'square-plus':  'M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z',
  'square-minus': 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z',
  'ellipsis':   'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
  'filter':     'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z',
  // Stroke icons (outline style)
  'edit':    { paths: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z', stroke: true },
  'search':  { paths: 'M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z', stroke: true },
  'user':    { paths: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', stroke: true },
  'trash':   { paths: 'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M10 11v6 M14 11v6', stroke: true },
  'eye':     { paths: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', stroke: true },
  'moon':     'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  'sun':      { paths: 'M12 2v4 M12 18v4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M2 12h4 M18 12h4 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83 M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', stroke: true },
  'bell':     'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  'bell-off': { paths: 'M13.73 21a2 2 0 0 1-3.46 0 M18.63 13A17.89 17.89 0 0 1 18 8 M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14 M18 8a6 6 0 0 0-9.33-4.97 M1 1l22 22', stroke: true },
  'volume-x': 'M11 5L6 9H2v6h4l5 4V5z M23 9l-6 6 M17 9l6 6',
  'volume-2': 'M11 5L6 9H2v6h4l5 4V5z M19.07 4.93a10 10 0 0 1 0 14.14 M15.54 8.46a5 5 0 0 1 0 7.07',
  'typescript': {
    paths: [
      { d: 'M2,2h28v28H2V2z', fill: '#3178c6' },
      { d: 'M18.245,23.759v3.068a6.492,6.492,0,0,0,1.764.575,11.56,11.56,0,0,0,2.146.192,9.968,9.968,0,0,0,2.088-.211,5.11,5.11,0,0,0,1.735-.7,3.542,3.542,0,0,0,1.181-1.266,4.469,4.469,0,0,0,.186-3.394,3.409,3.409,0,0,0-.717-1.117,5.236,5.236,0,0,0-1.123-.877,12.027,12.027,0,0,0-1.477-.734q-.6-.249-1.08-.484a5.5,5.5,0,0,1-.813-.479,2.089,2.089,0,0,1-.516-.518,1.091,1.091,0,0,1-.181-.618,1.039,1.039,0,0,1,.162-.571,1.4,1.4,0,0,1,.459-.436,2.439,2.439,0,0,1,.726-.283,4.211,4.211,0,0,1,.956-.1,5.942,5.942,0,0,1,.808.058,6.292,6.292,0,0,1,.856.177,5.994,5.994,0,0,1,.836.3,4.657,4.657,0,0,1,.751.422V13.9a7.509,7.509,0,0,0-1.525-.4,12.426,12.426,0,0,0-1.9-.129,8.767,8.767,0,0,0-2.064.235,5.239,5.239,0,0,0-1.716.733,3.655,3.655,0,0,0-1.171,1.271,3.731,3.731,0,0,0-.431,1.845,3.588,3.588,0,0,0,.789,2.34,6,6,0,0,0,2.395,1.639q.63.26,1.175.509a6.458,6.458,0,0,1,.942.517,2.463,2.463,0,0,1,.626.585,1.2,1.2,0,0,1,.23.719,1.1,1.1,0,0,1-.144.552,1.269,1.269,0,0,1-.435.441,2.381,2.381,0,0,1-.726.292,4.377,4.377,0,0,1-1.018.105,5.773,5.773,0,0,1-1.969-.35A5.874,5.874,0,0,1,18.245,23.759Zm-5.154-7.638h4V13.594H5.938v2.527H9.92V27.375h3.171Z', fill: '#fff' },
    ],
    viewBox: '0 0 32 32',
  },
})

// --- Gradient defs demo: two registration styles for the same raw <svg> markup ---

// 1. Raw <svg> string: recognized by its `<svg` prefix and rendered as-is
//    (linear/radial gradient fills intact)
const RUBY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 128 128"><title>ruby</title><linearGradient id="SVGVoYEpbAY" x1="157.08" x2="131.682" y1="2382.05" y2="2426.892" gradientTransform="matrix(1 0 0 -1 -47.5 2517)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fb7655"/><stop offset="0" stop-color="#fb7655"/><stop offset=".41" stop-color="#e42b1e"/><stop offset=".99" stop-color="#900"/><stop offset="1" stop-color="#900"/></linearGradient><path fill="url(#SVGVoYEpbAY)" d="M97.078 83.214L28.34 124.031l89.003-6.04l6.855-89.745z"/><linearGradient id="SVGqZa25jMv" x1="169.731" x2="136.998" y1="2419.72" y2="2441.685" gradientTransform="matrix(1 0 0 -1 -47.5 2517)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#871101"/><stop offset="0" stop-color="#871101"/><stop offset=".99" stop-color="#911209"/><stop offset="1" stop-color="#911209"/></linearGradient><path fill="url(#SVGqZa25jMv)" d="m117.488 117.93l-7.649-52.799l-20.837 27.514z"/><linearGradient id="SVGbKcL6cfD" x1="143.542" x2="110.81" y1="2380.69" y2="2402.655" gradientTransform="matrix(1 0 0 -1 -47.5 2517)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#871101"/><stop offset="0" stop-color="#871101"/><stop offset=".99" stop-color="#911209"/><stop offset="1" stop-color="#911209"/></linearGradient><path fill="url(#SVGbKcL6cfD)" d="m117.592 117.93l-56.044-4.399l-32.91 10.385z"/><linearGradient id="SVGCbfOewfa" x1="74.817" x2="79.891" y1="2435.622" y2="2402.644" gradientTransform="matrix(1 0 0 -1 -47.5 2517)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="0" stop-color="#fff"/><stop offset=".23" stop-color="#e57252"/><stop offset=".46" stop-color="#de3b20"/><stop offset=".99" stop-color="#a60003"/><stop offset="1" stop-color="#a60003"/></linearGradient><path fill="url(#SVGCbfOewfa)" d="m28.717 123.928l14.001-45.867l-30.81 6.588z"/><linearGradient id="SVGwnVp1dNv" x1="109.719" x2="111.589" y1="2466.413" y2="2432.757" gradientTransform="matrix(1 0 0 -1 -47.5 2517)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="0" stop-color="#fff"/><stop offset=".23" stop-color="#e4714e"/><stop offset=".56" stop-color="#be1a0d"/><stop offset=".99" stop-color="#a80d00"/><stop offset="1" stop-color="#a80d00"/></linearGradient><path fill="url(#SVGwnVp1dNv)" d="m88.996 92.797l-12.882-50.46l-36.866 34.558z"/><linearGradient id="SVGBvOKbcbg" x1="140.691" x2="146.289" y1="2497.523" y2="2473.401" gradientTransform="matrix(1 0 0 -1 -47.5 2517)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="0" stop-color="#fff"/><stop offset=".18" stop-color="#e46342"/><stop offset=".4" stop-color="#c82410"/><stop offset=".99" stop-color="#a80d00"/><stop offset="1" stop-color="#a80d00"/></linearGradient><path fill="url(#SVGBvOKbcbg)" d="M121.275 43.047L86.426 14.585l-9.704 31.373z"/><linearGradient id="SVGglMonb4A" x1="123.6" x2="147.719" y1="2506.018" y2="2518.077" gradientTransform="matrix(1 0 0 -1 -47.5 2517)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="0" stop-color="#fff"/><stop offset=".54" stop-color="#c81f11"/><stop offset=".99" stop-color="#bf0905"/><stop offset="1" stop-color="#bf0905"/></linearGradient><path fill="url(#SVGglMonb4A)" d="M104.978 4.437L84.481 15.764L71.551 4.285z"/><linearGradient id="SVGbFXCOeIb" x1="53.674" x2="55.66" y1="2444.028" y2="2424.153" gradientTransform="matrix(1 0 0 -1 -47.5 2517)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="0" stop-color="#fff"/><stop offset=".31" stop-color="#de4024"/><stop offset=".99" stop-color="#bf190b"/><stop offset="1" stop-color="#bf190b"/></linearGradient><path fill="url(#SVGbFXCOeIb)" d="m3.802 100.034l8.586-15.659L5.442 65.72z"/><path fill="#fff" d="m4.981 65.131l6.987 19.821l30.365-6.812L77 45.922l9.783-31.075L71.38 3.969l-26.19 9.802c-8.252 7.675-24.263 22.86-24.84 23.146c-.573.291-10.575 19.195-15.369 28.214"/><linearGradient id="SVG9N7OUlxf" x1="40.026" x2="133.345" y1="2418.781" y2="2514.739" gradientTransform="matrix(1 0 0 -1 -47.5 2517)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#bd0012"/><stop offset="0" stop-color="#bd0012"/><stop offset=".07" stop-color="#fff"/><stop offset=".17" stop-color="#fff"/><stop offset=".27" stop-color="#c82f1c"/><stop offset=".33" stop-color="#820c01"/><stop offset=".46" stop-color="#a31601"/><stop offset=".72" stop-color="#b31301"/><stop offset=".99" stop-color="#e82609"/><stop offset="1" stop-color="#e82609"/></linearGradient><path fill="url(#SVG9N7OUlxf)" d="M29.519 29.521c17.882-17.73 40.937-28.207 49.785-19.28c8.843 8.926-.534 30.62-18.418 48.345S20.233 87.365 11.393 78.438c-8.849-8.92.242-31.191 18.126-48.917"/><linearGradient id="SVGTzKcMb0B" x1="111.507" x2="83.398" y1="2409.102" y2="2416.039" gradientTransform="matrix(1 0 0 -1 -47.5 2517)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#8c0c01"/><stop offset="0" stop-color="#8c0c01"/><stop offset=".54" stop-color="#990c00"/><stop offset=".99" stop-color="#a80d0e"/><stop offset="1" stop-color="#a80d0e"/></linearGradient><path fill="url(#SVGTzKcMb0B)" d="m28.717 123.909l13.89-46.012l46.135 14.82c-16.68 15.642-35.233 28.865-60.025 31.192"/><linearGradient id="SVGFXqDAWwr" x1="159.785" x2="134.814" y1="2442.837" y2="2465.217" gradientTransform="matrix(1 0 0 -1 -47.5 2517)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#7e110b"/><stop offset="0" stop-color="#7e110b"/><stop offset=".99" stop-color="#9e0c00"/><stop offset="1" stop-color="#9e0c00"/></linearGradient><path fill="url(#SVGFXqDAWwr)" d="m77.062 45.831l11.844 46.911c13.934-14.65 26.439-30.401 32.563-49.883z"/><linearGradient id="SVGnIzMkbAq" x1="168.959" x2="156.521" y1="2483.901" y2="2497.199" gradientTransform="matrix(1 0 0 -1 -47.5 2517)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#79130d"/><stop offset="0" stop-color="#79130d"/><stop offset=".99" stop-color="#9e120b"/><stop offset="1" stop-color="#9e120b"/></linearGradient><path fill="url(#SVGnIzMkbAq)" d="M121.348 43.097c4.74-14.305 5.833-34.825-16.517-38.635l-18.339 10.13z"/><path fill="#9e1209" d="M3.802 99.828c.656 23.608 17.689 23.959 24.945 24.167l-16.759-39.14z"/><radialGradient id="SVGGuC8bNMy" cx="138.703" cy="2464.789" r="30.601" gradientTransform="matrix(1 0 0 -1 -47.5 2517)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#a80d00"/><stop offset="0" stop-color="#a80d00"/><stop offset=".99" stop-color="#7e0e08"/><stop offset="1" stop-color="#7e0e08"/></radialGradient><path fill="url(#SVGGuC8bNMy)" d="M77.128 45.904c10.708 6.581 32.286 19.798 32.723 20.041c.68.383 9.304-14.542 11.261-22.976z"/><radialGradient id="SVGDT7gOdfT" cx="96.325" cy="2424.465" r="40.679" gradientTransform="matrix(1 0 0 -1 -47.5 2517)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#a30c00"/><stop offset="0" stop-color="#a30c00"/><stop offset=".99" stop-color="#800e08"/><stop offset="1" stop-color="#800e08"/></radialGradient><path fill="url(#SVGDT7gOdfT)" d="m42.589 77.897l18.57 35.828c10.98-5.955 19.579-13.211 27.454-20.983z"/><linearGradient id="SVGT3Lj4rnu" x1="67.509" x2="57.373" y1="2393.115" y2="2427.506" gradientTransform="matrix(1 0 0 -1 -47.5 2517)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#8b2114"/><stop offset="0" stop-color="#8b2114"/><stop offset=".43" stop-color="#9e100a"/><stop offset=".99" stop-color="#b3100c"/><stop offset="1" stop-color="#b3100c"/></linearGradient><path fill="url(#SVGT3Lj4rnu)" d="m11.914 84.904l-2.631 31.331c4.964 6.781 11.794 7.371 18.96 6.842c-5.184-12.9-15.538-38.696-16.329-38.173"/><linearGradient id="SVGLoPUibOd" x1="145.272" x2="167.996" y1="2507.076" y2="2497.045" gradientTransform="matrix(1 0 0 -1 -47.5 2517)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#b31000"/><stop offset="0" stop-color="#b31000"/><stop offset=".44" stop-color="#910f08"/><stop offset=".99" stop-color="#791c12"/><stop offset="1" stop-color="#791c12"/></linearGradient><path fill="url(#SVGLoPUibOd)" d="m86.384 14.67l36.891 5.177c-1.969-8.343-8.015-13.727-18.32-15.41z"/></svg>`

IconRegistry.add({
  'ruby': RUBY_SVG,
  // 2. IconRawSvg object: explicit registration with an optional viewBox override
  'ruby-obj': { rawSvg: RUBY_SVG, viewBox: '0 0 128 128' },
})

// ── Exported option arrays (used by per-page scripts) ─────────────────
export const FRUIT_OPTIONS = [
  { label: 'Apple',  value: 'apple'  },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Grape',  value: 'grape'  },
]

export const COLOR_OPTIONS = [
  { label: 'Red',    value: 'red'    },
  { label: 'Green',  value: 'green'  },
  { label: 'Blue',   value: 'blue'   },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Purple', value: 'purple' },
]

export const POSITION_OPTIONS = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
]


// --- Event logging ---
const log = document.getElementById('event-log')
const clearBtn = document.getElementById('clear-log')

function appendLog(msg: string) {
  if (!log) return
  const line = document.createElement('div')
  line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`
  log.prepend(line)
  // Keep max 50 lines
  while (log.children.length > 50) log.lastChild?.remove()
}

clearBtn?.addEventListener('click', () => { if (log) log.innerHTML = '' })

// Listen for component events on body (they bubble)
const events = ['change', 'field-change', 'field-reset', 'field-clear', 'button-click', 'alert-close', 'dialog-open', 'dialog-close', 'tab-change', 'open', 'close']
events.forEach(eventName => {
  document.body.addEventListener(eventName, ((e: CustomEvent) => {
    const tag = (e.target as HTMLElement).tagName.toLowerCase()
    let detail = ''
    try {
      if (e.detail) {
        // Filter out DOM element references before stringifying
        const safe = Object.fromEntries(
          Object.entries(e.detail).filter(([, v]) => !(v instanceof HTMLElement))
        )
        detail = Object.keys(safe).length ? JSON.stringify(safe) : ''
      }
    } catch { /* ignore */ }
    appendLog(`${tag} - ${eventName}${detail ? ' ' + detail : ''}`)
  }) as EventListener)
})

// --- Theme switching ---

let isDark = localStorage.getItem('aeico-demo-theme') === 'dark'

function applyTheme(silent = false) {
  const btn = document.getElementById('theme-toggle')
  if (isDark) {
    document.documentElement.setAttribute('theme', 'dark')
    if (btn) btn.textContent = '☀️ Light'
  } else {
    document.documentElement.removeAttribute('theme')
    if (btn) btn.textContent = '🌙 Dark'
  }
  if (!silent) appendLog(`theme - ${isDark ? 'dark' : 'light'}`)
  // Sync theme to embedded iframe (when acting as shell)
  const frame = document.getElementById('content-frame') as HTMLIFrameElement | null
  frame?.contentWindow?.postMessage({ type: 'aeico-theme', dark: isDark }, '*')
}

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  isDark = !isDark
  localStorage.setItem('aeico-demo-theme', isDark ? 'dark' : 'light')
  applyTheme()
})

// Sync theme from parent shell when running inside an iframe
window.addEventListener('message', (e: MessageEvent) => {
  if (e.data?.type === 'aeico-theme') {
    isDark = Boolean(e.data.dark)
    applyTheme(true)
  }
  if (e.data?.type === 'aeico-lang' && e.data.lang) {
    const lang = e.data.lang as SupportedLang
    if (lang !== currentLang) {
      currentLang = lang
      applyLocaleToFields(LOCALES[lang])
      syncLangButtons()
    }
  }
  if (e.data?.type === 'aeico-radius' && e.data.value !== undefined) {
    applyRadius(e.data.value)
  }
})

// Apply persisted theme on startup (silent - no event log entry)
if (isDark) applyTheme(true)

// --- Radius applying (used from postMessage by shell) ---

// All possible radius class names
const RADIUS_CLASSES = [
  'ae-radius-square',
  'ae-radius-xs',
  'ae-radius-sm',
  'ae-radius-md',
  'ae-radius-lg',
  'ae-radius-xl',
  'ae-radius-pill',
  'ae-radius-circle',
] as const

// Detect whether we're running inside an iframe (demo page) or as the shell.
// In the shell we only sync to the iframe; in the iframe we apply to our own <html>.
const isIframe = window !== window.parent

// Map radius size names to the CSS value used to override all --ae-radius-* variables
const RADIUS_VALUE_MAP: Record<string, string | null> = {
  square: '0',
  xs:     '2px',
  sm:     null,  // default - remove overrides
  md:     '6px',
  lg:     '8px',
  xl:     '12px',
  pill:   '999px',
  circle: '50%',
}

const RADIUS_VARS = [
  '--ae-radius-square', '--ae-radius-xs', '--ae-radius-sm',
  '--ae-radius-md', '--ae-radius-lg', '--ae-radius-xl',
  '--ae-radius-pill', '--ae-radius-circle',
] as const

function applyRadius(value: string) {
  ;(window as any).__aeicoRadius = value

  // Only apply to our own document when running as a demo page inside the iframe
  if (isIframe) {
    const targetClass = `ae-radius-${value}`
    const root = document.documentElement
    const size = RADIUS_VALUE_MAP[value]

    // 1. Toggle ae-radius-* class on <html> (affects light DOM via radius.css)
    RADIUS_CLASSES.forEach(c => root.classList.remove(c))
    if (value !== 'sm') {
      root.classList.add(targetClass)
    }

    // 2. Override --ae-radius-* on :root (legacy, may not penetrate :host)
    if (size === null) {
      RADIUS_VARS.forEach(v => root.style.removeProperty(v))
    } else {
      RADIUS_VARS.forEach(v => root.style.setProperty(v, size))
    }

    // 3. Override --ae-radius-* on every custom element host via inline style.
    //    This is necessary because :host definitions in shadow DOM block
    //    inheritance from :root. Inline style on the host element has the
    //    highest priority and will be seen by the shadow DOM.
    const setOrRemove = (el: HTMLElement, v: string) => {
      if (size === null) {
        RADIUS_VARS.forEach(p => el.style.removeProperty(p))
      } else {
        RADIUS_VARS.forEach(p => el.style.setProperty(p, size))
      }
    }
    document.querySelectorAll('*').forEach(el => {
      if (el instanceof HTMLElement && el.tagName.includes('-')) {
        setOrRemove(el, size!)
      }
    })
  }

  // When acting as shell, sync to the embedded iframe
  const frame = document.getElementById('content-frame') as HTMLIFrameElement | null
  if (frame?.contentWindow) {
    frame.contentWindow.postMessage({ type: 'aeico-radius', value }, '*')
  }

  appendLog(`radius - ${value}`)
}

// Handle radius dropdown select
let currentRadius = 'sm'
;(window as any).__aeicoRadius = currentRadius

document.getElementById('radius-dropdown')?.addEventListener('select', (e: Event) => {
  const detail = (e as CustomEvent).detail
  const value = detail?.value as string | undefined
  if (value && RADIUS_CLASSES.includes(`ae-radius-${value}` as typeof RADIUS_CLASSES[number])) {
    currentRadius = value
    applyRadius(value)
  }
})

// --- Language switching ---

function syncLangButtons() {
  const enBtn = document.getElementById('lang-en')
  const zhBtn = document.getElementById('lang-zh')
  if (enBtn) enBtn.setAttribute('color', currentLang === 'en' ? 'primary' : 'default')
  if (zhBtn) zhBtn.setAttribute('color', currentLang === 'zh' ? 'primary' : 'default')
}

function switchLang(lang: SupportedLang) {
  if (lang === currentLang) return
  currentLang = lang
  ;(window as any).__aeicoLang = lang
  applyLocaleToFields(LOCALES[lang])
  syncLangButtons()
  appendLog(`language switched - ${lang}`)
  // Sync language to embedded iframe (when acting as shell)
  const frame = document.getElementById('content-frame') as HTMLIFrameElement | null
  frame?.contentWindow?.postMessage({ type: 'aeico-lang', lang }, '*')
}

document.getElementById('lang-en')?.addEventListener('click', () => switchLang('en'))
document.getElementById('lang-zh')?.addEventListener('click', () => switchLang('zh'))

// Init button states after DOM is ready
syncLangButtons()

// --- Dropdown events ---
document.querySelectorAll<any>('.dropdown-demo').forEach(el => {
  el.addEventListener('select', (e: CustomEvent) => {
    appendLog(`dropdown select - value: "${e.detail?.value}", label: "${e.detail?.label}"`)
  })
  el.addEventListener('open', () => appendLog('dropdown open'))
  el.addEventListener('close', () => appendLog('dropdown close'))
})

