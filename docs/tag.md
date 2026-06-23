# Tag

`Display` `Data`

An inline label for annotation, categorisation, or filtering. Supports a dismiss button to allow user removal.

## Import

```js
import 'aeico-components/tag';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-tag>Label</ae-tag>
```

### `color`

```html
<ae-tag color="default">Default</ae-tag>
<ae-tag color="primary">Primary</ae-tag>
<ae-tag color="success">Success</ae-tag>
<ae-tag color="danger">Danger</ae-tag>
<ae-tag color="warning">Warning</ae-tag>
<ae-tag color="info">Info</ae-tag>
```

### `variant`

```html
<ae-tag color="primary" variant="filled">Filled</ae-tag>
<ae-tag color="primary" variant="outlined">Outlined</ae-tag>
<ae-tag color="primary" variant="faint">Faint</ae-tag>
<ae-tag color="primary" variant="subtle">Subtle</ae-tag>
```

### `size`

```html
<ae-tag color="primary" size="xs">XS</ae-tag>
<ae-tag color="primary" size="sm">SM</ae-tag>
<ae-tag color="primary" size="md">MD</ae-tag>
<ae-tag color="primary" size="lg">LG</ae-tag>
```

### `pill`

```html
<ae-tag color="primary" pill>Rounded</ae-tag>
```

### `dismissible`

```html
<ae-tag color="success" dismissible>Active</ae-tag>
<ae-tag color="danger"  dismissible>Error</ae-tag>
```

### `disabled` — prevent dismissal

```html
<ae-tag color="info" dismissible disabled>Cannot remove</ae-tag>
```

### With `start` / `end` slots

```html
<ae-tag color="primary" variant="faint">
  <ae-icon slot="start" name="user"></ae-icon>
  Alice
</ae-tag>

<ae-tag color="success" variant="faint">
  Deployed
  <ae-icon slot="end" name="check"></ae-icon>
</ae-tag>
```

### Listening to `dismiss`

```html
<ae-tag id="t1" color="primary" dismissible>Removable</ae-tag>

<script type="module">
  import 'aeico-components/tag';
  document.querySelector('#t1').addEventListener('dismiss', () => {
    document.querySelector('#t1').remove();
  });
</script>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark'` | `'default'` | Semantic colour theme. |
| `variant` | `'filled' \| 'outlined' \| 'faint' \| 'subtle'` | `'filled'` | Visual style. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Tag size. |
| `pill` | `boolean` | `false` | Fully rounded (pill-shaped) corners. |
| `dismissible` | `boolean` | `false` | Shows a dismiss (×) button. |
| `disabled` | `boolean` | `false` | Prevents dismissal even when `dismissible` is set. |

## Slots

| Name | Description |
|------|-------------|
| (default) | Tag label text or content. |
| `start` | Content placed before the label (e.g. an icon or avatar). |
| `end` | Content placed after the label. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `dismiss` | — | Fired when the user clicks the dismiss button. |

## CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--ae-color-solid` | Background for `filled` variant. |
| `--ae-color-on-solid` | Text colour for `filled` variant. |
| `--ae-color-border` | Border colour for `outlined` variant. |
| `--ae-color-accent` | Accent colour for `faint` / `text` variants. |
| `--tag-subtle-bg` | Background for `subtle` / `faint` variants. |
| `--tag-subtle-color` | Text colour for `subtle` / `faint` variants. |
| `--tag-subtle-border` | Border colour for `faint` variant. |

## CSS Parts

| Part | Description |
|------|-------------|
| `tag` | The root tag element. |
