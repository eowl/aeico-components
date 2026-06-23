# Radio Group

`Form` `Input`

A single-choice selection control. Supports three display modes: classic radio buttons, individual toggle buttons, and a compact segmented button group.

## Import

```js
import 'aeico-components/radio-group';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic — string options

```html
<ae-radio-group options='["Option A", "Option B", "Option C"]'></ae-radio-group>
```

### Object options with labels and values

```html
<ae-radio-group options='[
  { "value": "xs", "label": "Extra Small" },
  { "value": "sm", "label": "Small" },
  { "value": "md", "label": "Medium" },
  { "value": "lg", "label": "Large" }
]'></ae-radio-group>
```

### Disabled option

```html
<ae-radio-group options='[
  { "value": "a", "label": "Available" },
  { "value": "b", "label": "Unavailable", "disabled": true },
  { "value": "c", "label": "Available" }
]'></ae-radio-group>
```

### `mode="button"` — toggle button style

```html
<ae-radio-group
  mode="button"
  color="primary"
  options='["Daily", "Weekly", "Monthly"]'>
</ae-radio-group>
```

### `mode="button-group"` — compact segmented control

```html
<ae-radio-group
  mode="button-group"
  color="primary"
  variant="outlined"
  options='["List", "Grid", "Board"]'>
</ae-radio-group>
```

### `color` and `variant`

```html
<ae-radio-group mode="button" color="success" options='["Yes", "No"]'></ae-radio-group>
<ae-radio-group mode="button" color="primary" variant="outlined" options='["A", "B", "C"]'></ae-radio-group>
```

### `size`

```html
<ae-radio-group mode="button-group" color="primary" size="sm" options='["S", "M", "L"]'></ae-radio-group>
<ae-radio-group mode="button-group" color="primary" size="lg" options='["S", "M", "L"]'></ae-radio-group>
```

### `allowEmpty` — allow deselecting

```html
<ae-radio-group
  mode="button"
  color="primary"
  allowEmpty
  options='["Bold", "Italic", "Underline"]'>
</ae-radio-group>
```

### Using `<ae-radio>` slot children

Slot-based `<ae-radio>` elements are merged with the `options` prop.

```html
<ae-radio-group mode="button" color="primary">
  <ae-radio value="apple">🍎 Apple</ae-radio>
  <ae-radio value="banana">🍌 Banana</ae-radio>
  <ae-radio value="cherry" disabled>🍒 Cherry</ae-radio>
</ae-radio-group>
```

### Listening to `change`

```html
<ae-radio-group id="rg" options='["A", "B", "C"]'></ae-radio-group>

<script type="module">
  import 'aeico-components/radio-group';
  document.querySelector('#rg').addEventListener('change', (e) => {
    console.log('Selected:', e.detail.value);
  });
</script>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `options` | `string[] \| Array<{ value: string, label: string, disabled?: boolean }>` | — | Options to render. Can be a JSON string in HTML or a JS array. |
| `mode` | `'default' \| 'button' \| 'button-group'` | `'default'` | Display mode: classic radio, individual buttons, or segmented control. |
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark'` | `'default'` | Selected item colour (for `button` and `button-group` modes). |
| `variant` | `'filled' \| 'outlined' \| 'faint' \| 'subtle' \| 'text'` | `'filled'` | Selected item style (for `button` and `button-group` modes). |
| `size` | `'3xs' \| '2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Button size (for `button` and `button-group` modes). |
| `allowEmpty` | `boolean` | `false` | Allows clicking the selected item to deselect it. |

## Slots

| Name | Description |
|------|-------------|
| (default) | `<ae-radio>` elements. These are merged with the `options` prop. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ value: string, oldValue: string, action: string }` | Fired when the selection changes. |

## CSS Custom Properties

Apply to `button` and `button-group` modes.

Colour tokens (derived from the global `--ae-color-*` tokens, overridable on `<ae-radio-group>`):

| Token | Controls |
|-------|----------|
| `--ae-color-solid` | Background for the selected button. |
| `--ae-color-on-solid` | Text colour for selected button. |
| `--ae-color-border` | Border colour for `outlined` variant. |
| `--ae-color-accent` | Accent colour for `faint` / `text` variants. |
| `--ae-color-subtle` | Background for `subtle` / `faint` variants. |

Layout tokens (component-specific):

| Property | Description |
|----------|-------------|
| `--rg-font-size` | Button font size (default `1em`). |
| `--rg-height` | Button height (default `2.286em`). |
| `--rg-padding` | Button padding (default `0.429em 1.071em`). |
| `--rg-min-width` | Minimum button width (default `4.571em`). |
| `--rg-radius` | Button corner radius (default `4px`). |
| `--rg-font-weight` | Button font weight (default `400`). |
