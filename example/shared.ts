import {
  TextInput,
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
  Divider,
  Card,
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
} from '../src/index'
import '../src/styles/layout.css'
void [TextInput, Select, Slider, Checkbox, RadioGroup, Icon, Switch, Tabs, Tab, TabPanel, Dialog, Divider, Card, Badge, Tag, Breadcrumb, BreadcrumbItem, Navbar, Dropdown, DropdownItem, Detail, ProgressBar, Textarea]
import { locale } from 'aeico-localize'

// --- Localization setup ---

type LocaleData = { [key: string]: string | LocaleData }

const LOCALES: Record<string, LocaleData> = {
  en: {
    buttons: {
      reset: 'Reset',
      clear: 'Clear',
      cancel: 'Cancel',
    },
    alert: {
      close: 'Close alert',
    },
  },
  zh: {
    buttons: {
      reset: '重置',
      clear: '清除',
      cancel: '取消',
    },
    alert: {
      close: '关闭提示',
    },
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
locale.update(currentLang, LOCALES[currentLang])


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
  'chevron-right': 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
  'chevron-down':  'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z',
  'chevron-up':   'M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z',
  'square-plus':  'M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z',
  'square-minus': 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z',
  // Stroke icons (outline style)
  'edit':    { path: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z', stroke: true, strokeWidth: 2 },
  'search':  { path: 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z M21 21l-4.35-4.35', stroke: true, strokeWidth: 2 },
  'user':    { path: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', stroke: true, strokeWidth: 2 },
  'trash':   { path: 'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M10 11v6 M14 11v6', stroke: true, strokeWidth: 2 },
  'eye':     { path: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', stroke: true, strokeWidth: 2 },
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
const log = document.getElementById('event-log')!
const clearBtn = document.getElementById('clear-log')!

function appendLog(msg: string) {
  const line = document.createElement('div')
  line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`
  log.prepend(line)
  // Keep max 50 lines
  while (log.children.length > 50) log.lastChild?.remove()
}

clearBtn.addEventListener('click', () => { log.innerHTML = '' })

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
    appendLog(`${tag} → ${eventName}${detail ? ' ' + detail : ''}`)
  }) as EventListener)
})

// --- Theme switching ---

let isDark = false

function applyTheme() {
  const btn = document.getElementById('theme-toggle')
  if (isDark) {
    document.documentElement.setAttribute('theme', 'dark')
    if (btn) btn.textContent = '☀️ Light'
  } else {
    document.documentElement.removeAttribute('theme')
    if (btn) btn.textContent = '🌙 Dark'
  }
  appendLog(`theme → ${isDark ? 'dark' : 'light'}`)
}

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  isDark = !isDark
  applyTheme()
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
  locale.update(lang, LOCALES[lang])
  syncLangButtons()
  appendLog(`language switched → ${lang}`)
}

document.getElementById('lang-en')?.addEventListener('click', () => switchLang('en'))
document.getElementById('lang-zh')?.addEventListener('click', () => switchLang('zh'))

// Init button states after DOM is ready
syncLangButtons()

// --- Dropdown events ---
document.querySelectorAll<any>('.dropdown-demo').forEach(el => {
  el.addEventListener('select', (e: CustomEvent) => {
    appendLog(`dropdown select → value: "${e.detail?.value}", label: "${e.detail?.label}"`)
  })
  el.addEventListener('open', () => appendLog('dropdown open'))
  el.addEventListener('close', () => appendLog('dropdown close'))
})

