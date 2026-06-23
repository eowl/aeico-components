# Badge

`Display` `Data`

A compact label used to highlight statuses, counts, or categories alongside other content.

## Import

```js
import 'aeico-components/badge';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-badge color="success">Active</ae-badge>
```

### `color`

```html
<ae-badge color="default">Default</ae-badge>
<ae-badge color="primary">Primary</ae-badge>
<ae-badge color="secondary">Secondary</ae-badge>
<ae-badge color="success">Success</ae-badge>
<ae-badge color="danger">Danger</ae-badge>
<ae-badge color="warning">Warning</ae-badge>
<ae-badge color="info">Info</ae-badge>
<ae-badge color="light">Light</ae-badge>
<ae-badge color="dark">Dark</ae-badge>
```

### `variant`

```html
<ae-badge color="primary" variant="filled">Filled</ae-badge>
<ae-badge color="primary" variant="outlined">Outlined</ae-badge>
<ae-badge color="primary" variant="faint">Faint</ae-badge>
<ae-badge color="primary" variant="subtle">Subtle</ae-badge>
<ae-badge color="primary" variant="text">Text</ae-badge>
```

### `size`

```html
<ae-badge color="info" size="3xs">3XS</ae-badge>
<ae-badge color="info" size="2xs">2XS</ae-badge>
<ae-badge color="info" size="xs">XS</ae-badge>
<ae-badge color="info" size="sm">SM</ae-badge>
<ae-badge color="info" size="md">MD</ae-badge>
<ae-badge color="info" size="lg">LG</ae-badge>
```

### `pill`

```html
<ae-badge color="danger" pill>99+</ae-badge>
```

### With icons using `start` / `end` slots

```html
<ae-badge color="success" variant="faint">
  <ae-icon slot="start" name="check-circle"></ae-icon>
  Verified
</ae-badge>

<ae-badge color="primary" variant="faint">
  New
  <ae-icon slot="end" name="arrow-right"></ae-icon>
</ae-badge>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark'` | `'default'` | Semantic colour theme. |
| `variant` | `'filled' \| 'outlined' \| 'faint' \| 'subtle' \| 'text'` | `'filled'` | Visual style. |
| `size` | `'3xs' \| '2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Badge size. |
| `pill` | `boolean` | `false` | Renders with fully rounded (pill-shaped) corners. |

## Slots

| Name | Description |
|------|-------------|
| (default) | Badge label text or content. |
| `start` | Content placed before the label (e.g. an icon). |
| `end` | Content placed after the label (e.g. an icon). |

## CSS Custom Properties

Badge uses the global `--ae-color-*` design tokens. Override on `<ae-badge>`:

| Token | Controls |
|-------|----------|
| `--ae-color-solid` | Background for `filled` variant. |
| `--ae-color-on-solid` | Text colour for `filled` variant. |
| `--ae-color-border` | Border colour for `outlined` variant. |
| `--ae-color-accent` | Accent colour (e.g. dot indicators). |
| `--ae-color-bg-subtle` | Background for `subtle` / `faint` variants. |
| `--ae-color-text-subtle` | Text colour for `subtle` / `faint` variants. |
| `--ae-color-border-subtle` | Border colour for `faint` / `outlined` variants. |
