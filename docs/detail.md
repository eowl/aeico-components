# Detail

`Display` `Interactive`

An expandable/collapsible content panel. The summary bar toggles the body. Supports custom expand/collapse icons and programmatic control via methods.

## Import

```js
import 'aeico-components/detail';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-detail summary="What is Aeico?">
  Aeico is a lightweight Web Components framework for building UI libraries.
</ae-detail>
```

### `summary` slot — rich header content

```html
<ae-detail>
  <span slot="summary">
    <ae-icon name="info-circle"></ae-icon>
    Advanced Settings
  </span>
  <p>These settings affect performance and behaviour.</p>
</ae-detail>
```

### `color`

```html
<ae-detail summary="Primary" color="primary">Content here.</ae-detail>
<ae-detail summary="Danger"  color="danger">Content here.</ae-detail>
```

### `variant`

```html
<ae-detail summary="Subtle"   color="primary" variant="subtle">...</ae-detail>
<ae-detail summary="Faint"    color="primary" variant="faint">...</ae-detail>
<ae-detail summary="Filled"   color="primary" variant="filled">...</ae-detail>
<ae-detail summary="Outlined" color="primary" variant="outlined">...</ae-detail>
```

### `disabled`

```html
<ae-detail summary="Locked section" disabled>Hidden content.</ae-detail>
```

### Custom expand/collapse icons

```html
<ae-detail summary="Custom icons">
  <ae-icon slot="expand"   name="plus-circle"></ae-icon>
  <ae-icon slot="collapse" name="minus-circle"></ae-icon>
  Body content.
</ae-detail>
```

### Programmatic control

```html
<ae-detail id="panel" summary="Click anywhere to open">Details here.</ae-detail>
<ae-button onclick="document.querySelector('#panel').toggle()">Toggle</ae-button>
```

### Listening to events

```html
<ae-detail id="d1" summary="Section">Content</ae-detail>

<script type="module">
  import 'aeico-components/detail';
  const el = document.querySelector('#d1');
  el.addEventListener('open',  () => console.log('opened'));
  el.addEventListener('close', () => console.log('closed'));
</script>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `summary` | `string` | — | Text label shown in the toggle bar. |
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark'` | — | Semantic colour theme. |
| `variant` | `'subtle' \| 'faint' \| 'filled' \| 'outlined'` | `'subtle'` | Visual style. |
| `disabled` | `boolean` | `false` | Prevents the panel from being toggled. |

## Slots

| Name | Description |
|------|-------------|
| (default) | The collapsible body content. |
| `summary` | Rich HTML alternative to the `summary` attribute. |
| `expand` | Custom icon shown when the panel is collapsed. |
| `collapse` | Custom icon shown when the panel is expanded. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `open` | — | Fired when the panel opens. |
| `close` | — | Fired when the panel closes. |

## CSS Custom Properties

Detail appearance is driven by global `--ae-color-*` tokens (vary by `variant`). Override on `<ae-detail>`:

| Token | Controls |
|-------|----------|
| `--ae-color-solid` | Body background (`filled` variant). |
| `--ae-color-on-solid` | Body text colour (`filled` variant). |
| `--ae-color-border` | Border colour (`outlined` variant). |
| `--detail-radius` | Border radius (default: `6px`). |
