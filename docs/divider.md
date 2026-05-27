# Divider

`Layout`

A thin line that visually separates content sections. Supports horizontal (default) and vertical orientations, with customisable thickness and colour.

## Import

```js
import 'aeico-components/divider';

// Full bundle
import 'aeico-components';
```

## Examples

### Horizontal (default)

```html
<p>Section A</p>
<ae-divider></ae-divider>
<p>Section B</p>
```

### `vertical`

Use inside a flex container to separate inline items.

```html
<div style="display: flex; align-items: center; gap: 8px;">
  <a href="#">Home</a>
  <ae-divider vertical></ae-divider>
  <a href="#">About</a>
  <ae-divider vertical></ae-divider>
  <a href="#">Contact</a>
</div>
```

### `thickness`

```html
<ae-divider thickness="2px"></ae-divider>
<ae-divider thickness="4px" color="primary"></ae-divider>
```

### `color`

```html
<ae-divider color="primary"></ae-divider>
<ae-divider color="danger"></ae-divider>
```

### Custom thickness via CSS variable

```html
<ae-divider style="--thickness: 3px;"></ae-divider>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `vertical` | `boolean` | `false` | Renders as a vertical line instead of horizontal. |
| `thickness` | `string` | `'1px'` | CSS value for the line thickness (e.g. `'2px'`, `'0.5rem'`). |
| `color` | `string` | — | Theme colour for the divider line. |

## CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--thickness` | Line thickness. Equivalent to setting the `thickness` attribute. |

## CSS Parts

| Part | Description |
|------|-------------|
| `divider` | The root line element. |
