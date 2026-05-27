# Menu

`Navigation`

A multi-level navigation menu. Supports two layout modes — **flyout** (sub-menus float out) and **inline** (accordion-style) — and horizontal or vertical orientation.

Includes two components: `ae-menu` (container) and `ae-menu-item` (each item/node).

## Import

```js
import 'aeico-components/menu';

// Full bundle
import 'aeico-components';
```

## Examples

### Vertical flyout (default)

```html
<ae-menu>
  <ae-menu-item key="home">Home</ae-menu-item>
  <ae-menu-item key="products" label="Products">
    <ae-menu-item key="web">Web Apps</ae-menu-item>
    <ae-menu-item key="mobile">Mobile</ae-menu-item>
  </ae-menu-item>
  <ae-menu-item key="about">About</ae-menu-item>
</ae-menu>
```

### `mode="inline"` — accordion style

```html
<ae-menu mode="inline">
  <ae-menu-item key="dashboard">Dashboard</ae-menu-item>
  <ae-menu-item key="settings" label="Settings">
    <ae-menu-item key="profile">Profile</ae-menu-item>
    <ae-menu-item key="security">Security</ae-menu-item>
  </ae-menu-item>
  <ae-menu-item key="help">Help</ae-menu-item>
</ae-menu>
```

### `orientation="horizontal"` — horizontal top nav

```html
<ae-menu orientation="horizontal">
  <ae-menu-item key="home">Home</ae-menu-item>
  <ae-menu-item key="docs" label="Docs">
    <ae-menu-item key="guide">Guide</ae-menu-item>
    <ae-menu-item key="api">API</ae-menu-item>
  </ae-menu-item>
  <ae-menu-item key="blog">Blog</ae-menu-item>
</ae-menu>
```

### `trigger="click"` — open sub-menus on click only

```html
<ae-menu trigger="click">
  <ae-menu-item key="a" label="Section A">
    <ae-menu-item key="a1">Sub-item A1</ae-menu-item>
  </ae-menu-item>
</ae-menu>
```

### `selectedKey`

```html
<ae-menu selectedKey="profile">
  <ae-menu-item key="dashboard">Dashboard</ae-menu-item>
  <ae-menu-item key="profile">Profile</ae-menu-item>
</ae-menu>
```

### Link items with `href`

```html
<ae-menu>
  <ae-menu-item key="home" href="/">Home</ae-menu-item>
  <ae-menu-item key="docs" href="/docs">Documentation</ae-menu-item>
</ae-menu>
```

### `disabled` item

```html
<ae-menu>
  <ae-menu-item key="active">Active Item</ae-menu-item>
  <ae-menu-item key="locked" disabled>Locked Item</ae-menu-item>
</ae-menu>
```

### Listening to `select`

```html
<ae-menu id="nav">
  <ae-menu-item key="home">Home</ae-menu-item>
  <ae-menu-item key="settings" label="Settings">
    <ae-menu-item key="profile">Profile</ae-menu-item>
  </ae-menu-item>
</ae-menu>

<script type="module">
  import 'aeico-components/menu';
  document.querySelector('#nav').addEventListener('select', (e) => {
    console.log('key:', e.detail.key, 'path:', e.detail.keyPath);
  });
</script>
```

---

## `ae-menu` Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `mode` | `'flyout' \| 'inline'` | `'flyout'` | Layout mode: floating sub-menus or accordion expansion. |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Root menu direction. |
| `trigger` | `'click' \| 'hover'` | `'hover'` | How sub-menus are opened. |
| `selectedKey` | `string` | — | Key of the currently selected/highlighted item. |

## `ae-menu` Slots

| Name | Description |
|------|-------------|
| (default) | `<ae-menu-item>` elements. |

## `ae-menu` Events

| Event | Detail | Description |
|-------|--------|-------------|
| `select` | `{ key: string, label: string, keyPath: string[] }` | Fired when a leaf item is clicked. `keyPath` is the array of ancestor keys leading to the selected item. |

---

## `ae-menu-item` Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `key` | `string` | — | Unique identifier for this item. Used in events and `selectedKey`. |
| `label` | `string` | — | When set, the item becomes a parent/submenu trigger. The sub-items go in the default slot. |
| `disabled` | `boolean` | `false` | Makes the item non-interactive. |
| `href` | `string` | — | Renders the item as an `<a>` anchor. |
| `selected` | `boolean` | `false` | Marks the item as selected (usually managed by the parent `ae-menu`). |
| `open` | `boolean` | `false` | Controls sub-menu visibility for parent items. |

## `ae-menu-item` Slots

| Name | Description |
|------|-------------|
| (default) | For leaf items: the label text. For parent items (`label` attribute set): nested `<ae-menu-item>` children. |

## `ae-menu-item` CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--menu-item-height` | Item height (default `2.5rem`). |
| `--menu-item-padding-x` | Item horizontal padding (default `0.875rem`). |
| `--menu-item-font-size` | Item font size (default `0.9375rem`). |
| `--menu-item-color` | Item text colour. |
| `--menu-item-color-disabled` | Text colour for disabled items. |
| `--menu-item-bg` | Item background colour. |
| `--menu-item-bg-hover` | Background colour on hover. |
| `--menu-item-active-color` | Text colour for the active/selected item. |
| `--menu-item-active-border-color` | Left-border colour for the active item (inline mode). |
| `--submenu-z-index` | Stack order of sub-menu panels. |
| `--submenu-bg` | Sub-menu panel background. |
| `--submenu-border` | Sub-menu panel border. |
| `--submenu-border-radius` | Sub-menu panel corner radius. |
| `--submenu-shadow` | Sub-menu panel box shadow. |
| `--submenu-min-width` | Minimum width of sub-menu panels. |
| `--submenu-padding` | Sub-menu panel internal padding. |
