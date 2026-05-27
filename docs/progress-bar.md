# Progress Bar

`Feedback` `Display`

A horizontal bar that visually represents the completion percentage of an operation. Supports a shimmer animation for indeterminate or in-progress states.

## Import

```js
import 'aeico-components/progress-bar';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-progress-bar value="50"></ae-progress-bar>
```

### `value`

The value is automatically clamped to the range 0–100.

```html
<ae-progress-bar value="0"></ae-progress-bar>
<ae-progress-bar value="25"></ae-progress-bar>
<ae-progress-bar value="75"></ae-progress-bar>
<ae-progress-bar value="100"></ae-progress-bar>
```

### `color`

```html
<ae-progress-bar value="60" color="primary"></ae-progress-bar>
<ae-progress-bar value="60" color="success"></ae-progress-bar>
<ae-progress-bar value="60" color="danger"></ae-progress-bar>
<ae-progress-bar value="60" color="warning"></ae-progress-bar>
```

### `animated`

Adds a moving shimmer over the fill to indicate activity.

```html
<ae-progress-bar value="65" animated></ae-progress-bar>
```

### `label` — accessible label

```html
<ae-progress-bar value="40" label="File upload progress"></ae-progress-bar>
```

### Custom height via CSS variable

```html
<ae-progress-bar value="70" style="--progress-height: 12px;"></ae-progress-bar>
```

### Custom fill colour via CSS variable

```html
<ae-progress-bar value="80" style="--progress-bar-color: #9333ea;"></ae-progress-bar>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `number` | `0` | Fill percentage (0–100). Automatically clamped. |
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark'` | `'primary'` | Fill colour theme. |
| `animated` | `boolean` | `false` | Adds a shimmer animation to indicate ongoing progress. |
| `label` | `string` | — | Sets `aria-label` on the progress element for screen readers. |

## CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--progress-height` | Track height (default `8px`). |
| `--progress-bar-color` | Fill colour override (bypasses the `color` attribute). |

## CSS Parts

| Part | Description |
|------|-------------|
| `base` | The root container element. |
| `track` | The grey background track. |
| `bar` | The coloured fill bar. |
