# Tooltip

`Feedback` `Overlay`

A floating label that appears near its trigger element. Provide plain text via the `content` attribute, or rich HTML via the `tooltip` named slot.

## Import

```js
import 'aeico-components/tooltip';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-tooltip content="Save your work">
  <ae-button color="primary">Save</ae-button>
</ae-tooltip>
```

### `placement`

```html
<ae-tooltip content="Top (default)" placement="top">
  <ae-button>Top</ae-button>
</ae-tooltip>

<ae-tooltip content="Bottom" placement="bottom">
  <ae-button>Bottom</ae-button>
</ae-tooltip>

<ae-tooltip content="Left" placement="left">
  <ae-button>Left</ae-button>
</ae-tooltip>

<ae-tooltip content="Right" placement="right">
  <ae-button>Right</ae-button>
</ae-tooltip>

<ae-tooltip content="Top Start" placement="top-start">
  <ae-button>Top Start</ae-button>
</ae-tooltip>

<ae-tooltip content="Bottom End" placement="bottom-end">
  <ae-button>Bottom End</ae-button>
</ae-tooltip>
```

### `trigger="click"` — show on click

```html
<ae-tooltip content="Copied!" trigger="click">
  <ae-button>Click me</ae-button>
</ae-tooltip>
```

### `open` — controlled visibility

```html
<ae-tooltip id="tt" content="Always visible" open>
  <ae-button>Hover target</ae-button>
</ae-tooltip>
```

### `disabled`

```html
<ae-tooltip content="This won't show" disabled>
  <ae-button>Hover me</ae-button>
</ae-tooltip>
```

### `tooltip` slot — rich HTML content

```html
<ae-tooltip>
  <ae-button color="info">
    <ae-icon name="info-circle"></ae-icon>
  </ae-button>
  <div slot="tooltip">
    <strong>Pro tip:</strong> Use keyboard shortcuts to speed up your workflow.
    <a href="/docs/shortcuts">Learn more</a>
  </div>
</ae-tooltip>
```

### Custom appearance via CSS variables

```html
<ae-tooltip
  content="Custom tooltip"
  style="
    --ae-tooltip-bg: #1e1b4b;
    --ae-tooltip-color: #e0e7ff;
    --ae-tooltip-border-radius: 8px;
    --ae-tooltip-font-size: 13px;
  ">
  <ae-button>Custom</ae-button>
</ae-tooltip>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `content` | `string` | — | Plain text tooltip. Use the `tooltip` slot for rich HTML. |
| `placement` | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'right'` | `'top'` | Position of the tooltip relative to the trigger. |
| `trigger` | `'hover' \| 'click'` | `'hover'` | How the tooltip is activated. |
| `open` | `boolean` | `false` | Controls tooltip visibility programmatically. |
| `disabled` | `boolean` | `false` | Prevents the tooltip from showing. |

## Slots

| Name | Description |
|------|-------------|
| (default) | The trigger element that the tooltip attaches to. |
| `tooltip` | Rich HTML content for the tooltip body. Takes priority over the `content` attribute. |

## CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--ae-tooltip-z-index` | Stack order of the tooltip. |
| `--ae-tooltip-bg` | Tooltip background colour. |
| `--ae-tooltip-color` | Tooltip text colour. |
| `--ae-tooltip-padding` | Tooltip padding. |
| `--ae-tooltip-font-size` | Tooltip font size. |
| `--ae-tooltip-border-radius` | Tooltip corner radius. |
| `--ae-tooltip-arrow-size` | Size of the directional arrow. |
| `--ae-tooltip-gap` | Gap between the tooltip and the trigger. |
| `--ae-tooltip-max-width` | Maximum tooltip width. |
