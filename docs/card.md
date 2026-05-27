# Card

`Display` `Layout`

A general-purpose container with an optional header and footer. Use `color` and `variant` to match the surrounding design context.

## Import

```js
import 'aeico-components/card';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-card>
  This is the card body content.
</ae-card>
```

### With header and footer

```html
<ae-card>
  <div slot="header">Card Title</div>
  <p>Body content goes here.</p>
  <div slot="footer">
    <ae-button size="sm" color="primary">Confirm</ae-button>
    <ae-button size="sm" variant="text">Cancel</ae-button>
  </div>
</ae-card>
```

### `color`

```html
<ae-card color="primary">Primary card</ae-card>
<ae-card color="success">Success card</ae-card>
<ae-card color="danger">Danger card</ae-card>
```

### `variant`

```html
<ae-card color="primary" variant="subtle">Subtle (default)</ae-card>
<ae-card color="primary" variant="faint">Faint</ae-card>
<ae-card color="primary" variant="filled">Filled</ae-card>
<ae-card color="primary" variant="outlined">Outlined</ae-card>
```

### Custom background via CSS variables

```html
<ae-card style="--card-bg: #1e1e2e; --card-color: #cdd6f4; --card-border: #313244;">
  Dark themed card
</ae-card>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark'` | `'default'` | Semantic colour theme. |
| `variant` | `'subtle' \| 'faint' \| 'filled' \| 'outlined'` | `'subtle'` | Visual style. |

## Slots

| Name | Description |
|------|-------------|
| (default) | Card body content. |
| `header` | Content rendered in the card header (hidden when empty). |
| `footer` | Content rendered in the card footer (hidden when empty). |

## CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--card-bg` | Card background colour. |
| `--card-color` | Card text colour. |
| `--card-border` | Card border colour. |
| `--card-divider` | Colour of the line between header / body / footer. |

## CSS Parts

| Part | Description |
|------|-------------|
| `card` | The root card element. |
| `header` | The header section. |
| `body` | The body section. |
| `footer` | The footer section. |
