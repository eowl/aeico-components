# Icon

`General`

Renders an SVG icon from the built-in icon library or from a custom-registered icon set. Supports fill mode (default), stroke mode, and colour theming.

## Import

```js
import 'aeico-components/icon';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-icon name="check"></ae-icon>
<ae-icon name="trash"></ae-icon>
<ae-icon name="arrow-right"></ae-icon>
```

### `size`

```html
<ae-icon name="star" size="3xs"></ae-icon>
<ae-icon name="star" size="xs"></ae-icon>
<ae-icon name="star" size="sm"></ae-icon>
<ae-icon name="star" size="md"></ae-icon>
<ae-icon name="star" size="lg"></ae-icon>
<ae-icon name="star" size="24"></ae-icon>
```

### `color`

```html
<ae-icon name="check-circle" color="success"></ae-icon>
<ae-icon name="x-circle"     color="danger"></ae-icon>
<ae-icon name="info-circle"  color="info"></ae-icon>
<ae-icon name="alert-triangle" color="warning"></ae-icon>
```

### `stroke` — outline rendering

```html
<ae-icon name="heart" stroke></ae-icon>
```

### `strokeWidth`

```html
<ae-icon name="heart" stroke strokeWidth="1"></ae-icon>
<ae-icon name="heart" stroke strokeWidth="2"></ae-icon>
<ae-icon name="heart" stroke strokeWidth="3"></ae-icon>
```

### Custom colour via CSS variables

```html
<ae-icon name="star" style="--icon-fill: gold;"></ae-icon>
<ae-icon name="circle" stroke style="--icon-stroke: #9333ea; --icon-stroke-width: 1.5;"></ae-icon>
```

### Registering custom icons

```js
import IconRegistry from 'aeico-components';

IconRegistry.register('my-logo', `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 22h20L12 2z"/>
  </svg>
`);
```

```html
<ae-icon name="my-logo" size="lg"></ae-icon>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | — | Icon identifier in the registry. |
| `size` | `'3xs' \| '2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| number` | `'md'` | Icon size. A numeric value sets an explicit pixel size. |
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark'` | — | Applies a theme colour to the icon. |
| `stroke` | `boolean` | `false` | Renders with stroke instead of fill. |
| `strokeWidth` | `number` | `2` | SVG stroke width. Only applies when `stroke` is `true`. |

## CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--icon-fill` | SVG fill colour (set automatically from `color`; can be overridden). |
| `--icon-stroke` | SVG stroke colour. |
| `--icon-stroke-width` | SVG stroke width. |
| `--icon-stroke-linecap` | SVG `stroke-linecap` value. |
| `--icon-stroke-linejoin` | SVG `stroke-linejoin` value. |
