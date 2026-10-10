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

### `stroke` - outline rendering

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

Icons can be registered as a path `d` string, a full raw `<svg>` string, or an
`IconDefinition` object:

```js
import IconRegistry from 'aeico-components';

IconRegistry.add({
  // Raw <svg> string (rendered as-is)
  'my-logo': `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 22h20L12 2z"/>
  </svg>
`,
  // Object form with per-path fill/stroke
  'my-two-tone': {
    paths: [
      { d: 'M12 2L2 22h20L12 2z', fill: '#387eb8' },
      { d: 'M12 2v20h10L12 2z', stroke: true, strokeWidth: 1.5 },
    ],
  },
});
```

```html
<ae-icon name="my-logo" size="lg"></ae-icon>
```

### Gradient fill (defs)

Icons can define gradients in `defs` and reference them via `fill: url(#id)`:

```js
import IconRegistry from 'aeico-components';

IconRegistry.add({
  'my-gradient-icon': {
    defs: [
      {
        type: 'linear',
        id: 'my-grad',
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 1,
        stops: [
          { offset: 0, stopColor: '#387eb8' },
          { offset: 1, stopColor: '#9333ea' },
        ],
      },
    ],
    paths: [{ d: 'M12 2L2 22h20L12 2z', fill: 'url(#my-grad)' }],
  },
});
```

```html
<ae-icon name="my-gradient-icon" size="lg"></ae-icon>
```

`radial` gradients are also supported (via `cx`/`cy`/`r`/`fx`/`fy`). When `id`
is omitted, a stable id (`ae-icon-grad-<index>`) is generated - reference it as
`url(#ae-icon-grad-0)`.

### Multi-path icons

Each path accepts `fill`, `stroke`, and `strokeWidth`. Paths without an
explicit `fill` fall back to `currentColor` (the `color` attribute / CSS
color chain):

```js
IconRegistry.add({
  'my-mixed': {
    paths: [
      { d: 'M4 4h16v16H4z', stroke: true, strokeWidth: 2 },
      { d: 'M8 12l3 3 5-6', stroke: true, strokeWidth: 2 },
    ],
  },
});
```

### Built-in icon set (opt-in)

A small set of public icons (`chevron-*`, `close`, `copy`, `check`, `ellipsis`,
`filter`, ...) ships with the library. It is **not** registered automatically -
import it explicitly:

```js
import 'aeico-components/built-in-icons';
```

```html
<ae-icon name="chevron-down"></ae-icon>
```

These public icons can be overridden via `IconRegistry.add()`; component
behavior is unaffected because components use the protected internal
`_`-prefixed icons (see below).

### Internal icons (reserved namespace)

Icons whose names start with `_` (e.g. `_chevron-right`) are used internally by
components (tree expand toggles, dialog close buttons, pagination arrows, ...).
They are stored in a protected registry and **cannot be overridden or shadowed**
by `IconRegistry.add()` - names with the `_` prefix are rejected for user
registration. This guarantees component behavior stays intact regardless of
user icon sets.

To customize a component's icon, use its configuration props instead (e.g.
`<ae-tree expand-icon="my-chevron">`).

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | - | Icon identifier in the registry. |
| `size` | `'3xs' \| '2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| number` | `'md'` | Icon size. A numeric value sets an explicit pixel size. |
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark'` | - | Applies a theme colour to the icon. |
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
