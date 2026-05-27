# Icon Button

`General` `Interactive`

> **⚠️ Deprecated.** `ae-icon-button` is deprecated and will be removed in a future version.  
> Use `<ae-button>` with a nested `<ae-icon>` instead:
>
> ```html
> <ae-button color="primary" variant="subtle">
>   <ae-icon name="star"></ae-icon>
> </ae-button>
> ```

A button that displays a single icon. Backed by the same visual system as `ae-button`.

## Import

```js
import 'aeico-components/icon-button';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-icon-button icon="star"></ae-icon-button>
```

### `color`

```html
<ae-icon-button icon="trash"  color="danger"></ae-icon-button>
<ae-icon-button icon="edit"   color="primary"></ae-icon-button>
<ae-icon-button icon="check"  color="success"></ae-icon-button>
```

### `variant`

```html
<ae-icon-button icon="settings" color="primary" variant="filled"></ae-icon-button>
<ae-icon-button icon="settings" color="primary" variant="outlined"></ae-icon-button>
<ae-icon-button icon="settings" color="primary" variant="subtle"></ae-icon-button>
<ae-icon-button icon="settings" color="primary" variant="text"></ae-icon-button>
```

### `size`

```html
<ae-icon-button icon="star" size="xs"></ae-icon-button>
<ae-icon-button icon="star" size="sm"></ae-icon-button>
<ae-icon-button icon="star" size="md"></ae-icon-button>
<ae-icon-button icon="star" size="lg"></ae-icon-button>
```

### `disabled`

```html
<ae-icon-button icon="trash" color="danger" disabled></ae-icon-button>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `icon` | `string` | — | Name of the icon to display (passed to `<ae-icon>`). |
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark'` | `'default'` | Semantic colour theme. |
| `variant` | `'filled' \| 'outlined' \| 'subtle' \| 'text'` | `'subtle'` | Visual style. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Button and icon size. |
| `disabled` | `boolean` | `false` | Disables the button. |

## CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--ib-icon-size` | Icon size override (default `1.286em`). |
| `--btn-solid-bg` | Background colour for `filled` variant. |
| `--btn-solid-bg-hover` | Background on hover (`filled`). |
| `--btn-solid-bg-active` | Background when pressed (`filled`). |
| `--btn-solid-color` | Text colour for `filled` variant. |
| `--btn-solid-color-hover` | Text colour on hover (`filled`). |
| `--btn-border` | Border colour for `outlined` variant. |
| `--btn-border-hover` | Border colour on hover (`outlined`). |
| `--btn-accent` | Accent colour for `faint` and `text` variants. |
| `--btn-accent-hover` | Accent colour on hover. |
| `--btn-subtle-bg` | Background for `subtle` / `faint` variants. |
| `--btn-subtle-bg-hover` | Background on hover for `subtle` / `faint` variants. |
