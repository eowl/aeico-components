# Button

`General` `Interactive`

Triggers actions or navigation. Supports multiple visual variants, semantic colour themes, sizes, and icon composition.

## Import

```js
import 'aeico-components/button';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-button>Click me</ae-button>
```

### `color`

```html
<ae-button color="default">Default</ae-button>
<ae-button color="primary">Primary</ae-button>
<ae-button color="secondary">Secondary</ae-button>
<ae-button color="success">Success</ae-button>
<ae-button color="danger">Danger</ae-button>
<ae-button color="warning">Warning</ae-button>
<ae-button color="info">Info</ae-button>
<ae-button color="light">Light</ae-button>
<ae-button color="dark">Dark</ae-button>
```

### `variant`

```html
<ae-button color="primary" variant="filled">Filled</ae-button>
<ae-button color="primary" variant="outlined">Outlined</ae-button>
<ae-button color="primary" variant="faint">Faint</ae-button>
<ae-button color="primary" variant="subtle">Subtle</ae-button>
<ae-button color="primary" variant="text">Text</ae-button>
```

### `size`

```html
<ae-button size="3xs">3XS</ae-button>
<ae-button size="2xs">2XS</ae-button>
<ae-button size="xs">XS</ae-button>
<ae-button size="sm">SM</ae-button>
<ae-button size="md">MD</ae-button>
<ae-button size="lg">LG</ae-button>
```

### `disabled`

```html
<ae-button color="primary" disabled>Disabled</ae-button>
```

### `type` — form submission

```html
<form>
  <ae-button type="submit" color="primary">Submit</ae-button>
  <ae-button type="reset">Reset</ae-button>
</form>
```

### `active` — toggle state

Use `active` to visually indicate a pressed or selected state (e.g. toolbar toggles).

```html
<ae-button color="primary" variant="outlined" active>Bold</ae-button>
```

### `block` — full-width

```html
<ae-button color="primary" block>Full Width</ae-button>
```

### With an icon

When the default slot contains only an `<ae-icon>`, the button automatically applies icon-button sizing and generates an accessible `aria-label` from the icon name.

```html
<!-- Text + icon -->
<ae-button color="primary">
  <ae-icon name="save"></ae-icon>
  Save
</ae-button>

<!-- Icon only -->
<ae-button color="primary" variant="subtle">
  <ae-icon name="trash"></ae-icon>
</ae-button>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark'` | `'default'` | Semantic colour theme. |
| `variant` | `'filled' \| 'outlined' \| 'faint' \| 'subtle' \| 'text'` | `'filled'` | Visual style. |
| `size` | `'3xs' \| '2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Button size. |
| `disabled` | `boolean` | `false` | Disables the button. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type for form integration. |
| `active` | `boolean` | `false` | Applies an active/pressed visual state. |
| `block` | `boolean` | `false` | Makes the button full-width. |

## Slots

| Name | Description |
|------|-------------|
| (default) | Button content — text, icons, or both. A slot containing only `<ae-icon>` enables icon-button mode. |

## CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--btn-solid-bg` | Background colour for `filled` variant. |
| `--btn-solid-bg-hover` | Background on hover (`filled`). |
| `--btn-solid-bg-active` | Background when pressed (`filled`). |
| `--btn-solid-color` | Text colour for `filled` variant. |
| `--btn-solid-color-hover` | Text colour on hover (`filled`). |
| `--btn-border` | Border colour for `outlined` variant. |
| `--btn-border-hover` | Border colour on hover (`outlined`). |
| `--btn-accent` | Accent/highlight colour for `faint` and `text` variants. |
| `--btn-accent-hover` | Accent colour on hover. |
| `--btn-subtle-bg` | Background for `subtle` / `faint` variants. |
| `--btn-subtle-bg-hover` | Background on hover for `subtle` / `faint` variants. |
