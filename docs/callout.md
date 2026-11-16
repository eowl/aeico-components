# Callout

`Display` `Feedback`

A highlighted callout for drawing attention to content. Supports an icon and a header on the same row, semantic colours via `color`, and an optional accent left border.

## Import

```js
import 'aeico-components/callout';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-callout>Some content in the callout.</ae-callout>
```

### With icon and header

```html
<ae-callout color="primary">
  <ae-icon slot="icon" name="star"></ae-icon>
  <span slot="header">Title</span>
  Some content in the callout.
</ae-callout>
```

The icon and header render on the same row; the body content sits below.

### `color`

```html
<ae-callout color="primary">Primary callout</ae-callout>
<ae-callout color="success">Success callout</ae-callout>
<ae-callout color="danger">Danger callout</ae-callout>
<ae-callout color="warning">Warning callout</ae-callout>
<ae-callout color="info">Info callout</ae-callout>
```

The header text follows the colour emphasis token (`--ae-color-text-subtle`); body content stays in the default text colour.

### `variant`

```html
<ae-callout color="primary" variant="subtle">Subtle</ae-callout>
<ae-callout color="primary" variant="faint">Faint</ae-callout>
<ae-callout color="primary">Filled (default)</ae-callout>
<ae-callout color="primary" variant="outlined">Outlined</ae-callout>
<ae-callout color="primary" variant="text">Text</ae-callout>
```

### `accent`

Adds a thick left border in the colour matching the `color` attribute.

```html
<ae-callout color="primary" accent>
  <ae-icon slot="icon" name="star"></ae-icon>
  <span slot="header">Note</span>
  Some content in the callout.
</ae-callout>
```

### Icon inside header

When no `icon` slot is used, an icon can be placed inline in the header instead.

```html
<ae-callout color="primary">
  <span slot="header">
    <ae-icon name="star" style="vertical-align: -0.15em; margin-right: 4px;"></ae-icon>Icon inside header
  </span>
  Some content in the callout.
</ae-callout>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark'` | `'default'` | Semantic colour theme. |
| `variant` | `'subtle' \| 'faint' \| 'filled' \| 'outlined' \| 'text'` | `'filled'` | Visual style. |
| `accent` | `boolean` | `false` | Shows a thick left border in the theme colour. |

## Slots

| Name | Description |
|------|-------------|
| (default) | Body content. |
| `icon` | Leading icon, rendered on the header row (hidden when empty). |
| `header` | Header content, rendered next to the icon (hidden when empty). |

## CSS Custom Properties

Callout appearance is driven by global `--ae-color-*` design tokens (vary by `variant` and `color`). Override on `<ae-callout>`:

| Token | Controls (default `filled` variant) |
|-------|--------------------------------------|
| `--ae-color-solid` | Callout background. |
| `--ae-color-on-solid` | Text colour on the filled background. |
| `--ae-color-text-subtle` | Header text colour (per `color`). |
| `--ae-color-border` | Accent left border colour. |
| `--ae-color-bg-subtle` | Background (default `subtle` variant). |
| `--ae-color-border-subtle` | Border colour (default `subtle` variant). |

## CSS Parts

| Part | Description |
|------|-------------|
| `callout` | The root callout element. |
| `header-row` | The row containing the icon and header. |
| `icon` | The icon container. |
| `header` | The header section. |
| `body` | The body section. |
