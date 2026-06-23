# Dropdown

`Navigation` `Overlay`

A floating menu attached to a trigger element. Use the `trigger` slot for full control over the trigger, or set `label` for a built-in button trigger.

This file covers three closely related components:
- **`ae-dropdown`** — the container that manages open/close state and positioning
- **`ae-dropdown-item`** — individual menu items inside a dropdown
- **`ae-dropdown-button`** — a self-contained button + dropdown in one element

## Import

```js
import 'aeico-components/dropdown';

// Full bundle
import 'aeico-components';
```

---

## `ae-dropdown` Examples

### Basic with `trigger` slot

```html
<ae-dropdown>
  <ae-button slot="trigger">Actions ▾</ae-button>
  <ae-dropdown-item value="edit">Edit</ae-dropdown-item>
  <ae-dropdown-item value="duplicate">Duplicate</ae-dropdown-item>
  <ae-dropdown-item value="delete" style="--dropdown-item-color: var(--ae-color-danger)">Delete</ae-dropdown-item>
</ae-dropdown>
```

### `label` — built-in trigger button

```html
<ae-dropdown label="Options">
  <ae-dropdown-item value="a">Option A</ae-dropdown-item>
  <ae-dropdown-item value="b">Option B</ae-dropdown-item>
</ae-dropdown>
```

### `placement`

```html
<ae-dropdown placement="bottom-start">
  <ae-button slot="trigger">Bottom Start (default)</ae-button>
  <ae-dropdown-item value="x">Item</ae-dropdown-item>
</ae-dropdown>

<ae-dropdown placement="top-end">
  <ae-button slot="trigger">Top End</ae-button>
  <ae-dropdown-item value="x">Item</ae-dropdown-item>
</ae-dropdown>
```

### `closeOnSelect="false"` — keep open after selection

```html
<ae-dropdown closeOnSelect="false">
  <ae-button slot="trigger">Multi-action</ae-button>
  <ae-dropdown-item value="1" type="checkbox">Option 1</ae-dropdown-item>
  <ae-dropdown-item value="2" type="checkbox">Option 2</ae-dropdown-item>
</ae-dropdown>
```

### `disabled`

```html
<ae-dropdown disabled>
  <ae-button slot="trigger" disabled>Disabled</ae-button>
  <ae-dropdown-item value="x">Item</ae-dropdown-item>
</ae-dropdown>
```

### Listening to `select`

```html
<ae-dropdown id="menu">
  <ae-button slot="trigger">Choose</ae-button>
  <ae-dropdown-item value="copy">Copy</ae-dropdown-item>
  <ae-dropdown-item value="paste">Paste</ae-dropdown-item>
</ae-dropdown>

<script type="module">
  import 'aeico-components/dropdown';
  document.querySelector('#menu').addEventListener('select', (e) => {
    console.log('Selected:', e.detail.value, e.detail.label);
  });
</script>
```

### Programmatic control

```html
<ae-dropdown id="dd">
  <ae-button slot="trigger">Open me</ae-button>
  <ae-dropdown-item value="x">Item</ae-dropdown-item>
</ae-dropdown>

<ae-button onclick="document.querySelector('#dd').toggle()">Toggle</ae-button>
```

## `ae-dropdown` Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `placement` | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'right' \| 'right-start' \| 'right-end' \| 'left' \| 'left-start' \| 'left-end'` | `'bottom-start'` | Position of the floating panel relative to the trigger. |
| `open` | `boolean` | `false` | Controls panel visibility. |
| `closeOnSelect` | `boolean` | `true` | Closes the panel after an item is selected. |
| `disabled` | `boolean` | `false` | Prevents the dropdown from opening. |
| `label` | `string` | — | When set, renders a built-in button as the trigger. |

## `ae-dropdown` Slots

| Name | Description |
|------|-------------|
| `trigger` | The element that opens/closes the dropdown. |
| (default) | `<ae-dropdown-item>` elements forming the menu. |

## `ae-dropdown` Events

| Event | Detail | Description |
|-------|--------|-------------|
| `open` | — | Fired when the panel opens. |
| `close` | — | Fired when the panel closes. |
| `select` | `{ value: string, label: string, checked: boolean }` | Fired when an item is clicked. |

## `ae-dropdown` CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--dropdown-z-index` | Stack order of the floating panel. |
| `--dropdown-bg` | Panel background colour. |
| `--dropdown-border` | Panel border. |
| `--dropdown-border-radius` | Panel corner radius. |
| `--dropdown-shadow` | Panel box shadow. |
| `--dropdown-min-width` | Minimum width of the panel. |
| `--dropdown-padding` | Panel internal padding. |

---

## `ae-dropdown-item` Examples

### Basic item

```html
<ae-dropdown-item value="profile">Profile</ae-dropdown-item>
```

### With an icon

```html
<ae-dropdown-item value="edit">
  <ae-icon name="edit"></ae-icon>
  Edit
</ae-dropdown-item>
```

### `disabled`

```html
<ae-dropdown-item value="export" disabled>Export (unavailable)</ae-dropdown-item>
```

### `href` — renders as a link

```html
<ae-dropdown-item href="/profile">Go to Profile</ae-dropdown-item>
<ae-dropdown-item href="/settings">Settings</ae-dropdown-item>
```

### `type="checkbox"` — toggleable item

```html
<ae-dropdown closeOnSelect="false">
  <ae-button slot="trigger">View</ae-button>
  <ae-dropdown-item value="labels"   type="checkbox" checked>Show Labels</ae-dropdown-item>
  <ae-dropdown-item value="tooltips" type="checkbox">Show Tooltips</ae-dropdown-item>
</ae-dropdown>
```

### `active` — highlight the current selection

```html
<ae-dropdown>
  <ae-button slot="trigger">Sort</ae-button>
  <ae-dropdown-item value="name"  active>Name ✓</ae-dropdown-item>
  <ae-dropdown-item value="date">Date</ae-dropdown-item>
  <ae-dropdown-item value="size">Size</ae-dropdown-item>
</ae-dropdown>
```

### Custom item colour

```html
<ae-dropdown-item value="delete" style="--dropdown-item-color: var(--ae-color-danger)">
  <ae-icon name="trash"></ae-icon>
  Delete
</ae-dropdown-item>
```

## `ae-dropdown-item` Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string` | — | Value emitted in the parent `select` event detail. |
| `disabled` | `boolean` | `false` | Makes the item non-interactive and visually dimmed. |
| `href` | `string` | — | When set, the item renders as an `<a>` anchor. |
| `type` | `'checkbox'` | — | Enables toggle mode; each click flips `checked`. |
| `checked` | `boolean` | `false` | Checked state for `type="checkbox"` items. |
| `active` | `boolean` | `false` | Highlights the item as the currently active/selected option. |

## `ae-dropdown-item` Slots

| Name | Description |
|------|-------------|
| (default) | Item label text. Can include `<ae-icon>` for leading icons. |

## `ae-dropdown-item` CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--dropdown-item-color` | Text colour override (e.g. set to `var(--ae-color-danger)` for destructive actions). |
| `--dropdown-item-color-disabled` | Text colour for disabled items. |
| `--dropdown-item-bg` | Item background colour. |
| `--dropdown-item-bg-hover` | Background colour on hover. |
| `--dropdown-item-bg-active` | Background colour when pressed. |
| `--dropdown-item-font-size` | Item font size. |
| `--dropdown-item-gap` | Gap between icon and text. |
| `--dropdown-item-border-radius` | Item corner radius. |
| `--dropdown-item-padding` | Item padding. |
| `--dropdown-item-transition` | CSS transition for background changes. |

## `ae-dropdown-item` CSS Parts

| Part | Description |
|------|-------------|
| `item` | The root button or anchor element. |

---

## `ae-dropdown-button` Examples

### Basic

```html
<ae-dropdown-button>
  More
  <ae-dropdown-item value="view">View</ae-dropdown-item>
  <ae-dropdown-item value="edit">Edit</ae-dropdown-item>
  <ae-dropdown-item value="delete">Delete</ae-dropdown-item>
</ae-dropdown-button>
```

### `color`, `variant`, `size`

```html
<ae-dropdown-button color="primary" variant="outlined" size="sm">
  Actions
  <ae-dropdown-item value="a">Action A</ae-dropdown-item>
  <ae-dropdown-item value="b">Action B</ae-dropdown-item>
</ae-dropdown-button>
```

### `placement`

```html
<ae-dropdown-button placement="top-start">
  Top Start
  <ae-dropdown-item value="x">Item</ae-dropdown-item>
</ae-dropdown-button>
```

### `label` slot — rich button content

```html
<ae-dropdown-button color="primary">
  <span slot="label">
    <ae-icon name="bolt"></ae-icon>
    Quick Actions
  </span>
  <ae-dropdown-item value="run">Run</ae-dropdown-item>
  <ae-dropdown-item value="stop">Stop</ae-dropdown-item>
</ae-dropdown-button>
```

## `ae-dropdown-button` Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark'` | `'default'` | Button colour theme. |
| `variant` | `'filled' \| 'outlined' \| 'faint' \| 'subtle' \| 'text'` | `'filled'` | Button visual style. |
| `size` | `'3xs' \| '2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Button size. |
| `disabled` | `boolean` | `false` | Disables the button and prevents the dropdown from opening. |
| `placement` | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'right' \| 'right-start' \| 'right-end' \| 'left' \| 'left-start' \| 'left-end'` | `'bottom-start'` | Position of the floating panel. |
| `closeOnSelect` | `boolean` | `true` | Closes the panel after an item is selected. |

## `ae-dropdown-button` Slots

| Name | Description |
|------|-------------|
| `label` | The button label content. |
| (default) | `<ae-dropdown-item>` elements. |

## `ae-dropdown-button` Events

| Event | Detail | Description |
|-------|--------|-------------|
| `open` | — | Fired when the panel opens. |
| `close` | — | Fired when the panel closes. |
| `select` | `{ value: string, label: string, checked: boolean }` | Fired when an item is clicked. |
