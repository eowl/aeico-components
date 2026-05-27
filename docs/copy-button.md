# Copy Button

`General` `Interactive`

Copies a specified text string to the clipboard when clicked. Shows a brief confirmation state with customisable tooltip messages.

## Import

```js
import 'aeico-components/copy-button';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic — copy from `text` attribute

```html
<ae-copy-button text="npm install aeico-components">Copy install command</ae-copy-button>
```

### Copy from slot content

When `text` is not set, the content of the default slot is copied.

```html
<ae-copy-button>npx create-aeico-app my-app</ae-copy-button>
```

### `color` and `variant`

```html
<ae-copy-button text="hello" color="primary" variant="outlined">Copy</ae-copy-button>
<ae-copy-button text="hello" color="success" variant="faint">Copy</ae-copy-button>
```

### `size`

```html
<ae-copy-button text="hello" size="sm">Copy</ae-copy-button>
<ae-copy-button text="hello" size="lg">Copy</ae-copy-button>
```

### `disabled`

```html
<ae-copy-button text="hello" disabled>Copy</ae-copy-button>
```

### `duration` — how long the confirmation is shown

```html
<!-- Shows "Copied!" for 4 seconds instead of the default 2 -->
<ae-copy-button text="hello" duration="4000">Copy</ae-copy-button>
```

### `tooltip` and `tooltipCopied` — custom tooltip text

```html
<ae-copy-button
  text="secret-token-abc"
  tooltip="Copy token"
  tooltipCopied="Token copied!"
>
  Copy Token
</ae-copy-button>
```

### `tooltipPlacement`

```html
<ae-copy-button text="hello" tooltipPlacement="bottom">Copy</ae-copy-button>
```

### Listening to `copy`

```html
<ae-copy-button id="cpbtn" text="Hello, World!">Copy</ae-copy-button>

<script type="module">
  import 'aeico-components/copy-button';
  document.querySelector('#cpbtn').addEventListener('copy', (e) => {
    console.log('Copied:', e.detail.text);
  });
</script>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `text` | `string` | — | Text to copy. Falls back to the default slot content when not set. |
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark'` | `'default'` | Button colour theme. |
| `variant` | `'filled' \| 'outlined' \| 'faint' \| 'subtle' \| 'text'` | `'filled'` | Button visual style. |
| `size` | `'3xs' \| '2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Button size. |
| `disabled` | `boolean` | `false` | Disables the copy action. |
| `duration` | `number` | `2000` | Milliseconds to show the "copied" confirmation. |
| `tooltip` | `string` | `'Copy'` | Tooltip shown before copying. |
| `tooltipCopied` | `string` | `'Copied!'` | Tooltip shown after a successful copy. |
| `tooltipPlacement` | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'right'` | `'top'` | Tooltip position. |

## Slots

| Name | Description |
|------|-------------|
| (default) | Button label. Also used as the copied text when `text` attribute is not set. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `copy` | `{ text: string }` | Fired after a successful clipboard write. |

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
| `--btn-accent` | Accent colour for `faint` and `text` variants. |
| `--btn-accent-hover` | Accent colour on hover. |
| `--btn-subtle-bg` | Background for `subtle` / `faint` variants. |
| `--btn-subtle-bg-hover` | Background on hover for `subtle` / `faint` variants. |

## CSS Parts

| Part | Description |
|------|-------------|
| `button` | The internal `<ae-button>` element. |
