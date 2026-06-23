# Alert

`Feedback` `Display`

Displays contextual feedback messages at a defined severity level. Supports dismissible mode and programmatic show/hide control.

## Import

```js
// Individual import (recommended)
import 'aeico-components/alert';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-alert color="info">Your session will expire in 10 minutes.</ae-alert>
```

### `color`

```html
<ae-alert color="primary">Primary message</ae-alert>
<ae-alert color="success">Operation completed successfully.</ae-alert>
<ae-alert color="danger">Something went wrong.</ae-alert>
<ae-alert color="warning">Please review before continuing.</ae-alert>
```

### `variant`

```html
<ae-alert color="info" variant="subtle">Subtle (default)</ae-alert>
<ae-alert color="info" variant="faint">Faint</ae-alert>
<ae-alert color="info" variant="filled">Filled</ae-alert>
<ae-alert color="info" variant="outlined">Outlined</ae-alert>
```

### `size`

```html
<ae-alert color="success" size="sm">Small alert</ae-alert>
<ae-alert color="success" size="md">Medium alert</ae-alert>
<ae-alert color="success" size="lg">Large alert</ae-alert>
```

### `dismissible`

```html
<ae-alert color="warning" dismissible>
  This alert can be closed by the user.
</ae-alert>
```

### `invisible` (programmatic visibility)

Use `invisible` to hide the alert initially, then call `.show()` / `.hide()` in JavaScript.

```html
<ae-alert id="notice" color="info" invisible>
  Loaded from API.
</ae-alert>

<script type="module">
  import 'aeico-components/alert';
  document.querySelector('#notice').show();
</script>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark'` | — | Sets the semantic colour and icon. |
| `variant` | `'subtle' \| 'faint' \| 'filled' \| 'outlined'` | `'subtle'` | Visual style of the alert. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Controls padding and font size. |
| `dismissible` | `boolean` | `false` | Shows a close (×) button. |
| `invisible` | `boolean` | `false` | Hides the alert. Use `.show()` / `.hide()` to control visibility. |
| `closeText` | `string` | — | Custom text for the close button's `title` attribute. Defaults to "Close alert". |

## Slots

| Name | Description |
|------|-------------|
| (default) | The message content. Accepts text or HTML. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `alert-close` | — | Fired when the user clicks the dismiss button. |

## CSS Custom Properties

| Variable | Description |
|----------|-------------|
| `--ae-color-solid` | Background color for `filled` variant. |
| `--alert-solid-color` | Text color for `filled` variant (defaults to `--color-on-solid`). |
| `--ae-color-border` | Border color for `outlined` variant. |
| `--alert-subtle-bg` | Background color for `subtle` / `faint` variants. |
| `--alert-subtle-color` | Text color for `subtle` / `faint` variants. |
| `--alert-subtle-border` | Border color for `faint` variant. |

## CSS Parts

| Part | Description |
|------|-------------|
| `alert` | The root alert container element. |
