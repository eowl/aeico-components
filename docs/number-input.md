# Number Input

`Form` `Input`

A numeric input field. Wraps the native `<input type="number">` element and exposes a consistent API with typed value management. Supports `min`, `max`, and `step` constraints.

## Import

```js
import 'aeico-components/number-input';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-number-input label="Age" placeholder="Enter age"></ae-number-input>
```

### `value` — controlled state

```html
<ae-number-input label="Quantity" value="10"></ae-number-input>
```

### `defaultValue` — uncontrolled initial value

```html
<ae-number-input label="Score" defaultValue="100"></ae-number-input>
```

### `min` / `max` — range constraints

```html
<ae-number-input label="Percentage" min="0" max="100" placeholder="0–100"></ae-number-input>
```

### `step` — increment step

```html
<ae-number-input label="Price" min="0" step="0.01" placeholder="0.00"></ae-number-input>
```

### `required`

```html
<form>
  <ae-number-input label="Count" required placeholder="Required"></ae-number-input>
  <ae-button type="submit" color="primary">Submit</ae-button>
</form>
```

### `disabled`

```html
<ae-number-input label="Read-only" value="42" disabled></ae-number-input>
```

### `controls` — show increment / decrement buttons

```html
<ae-number-input label="Quantity" controls value="10" min="0" max="100" step="5"></ae-number-input>
```

### `actionButtonStyle` — action button display style

```html
<!-- Integrated (default): buttons are attached to the input as one piece -->
<ae-number-input label="Integrated" clearable value="50" action-button-style="integrated"></ae-number-input>

<!-- Standalone: buttons are separate rounded icons -->
<ae-number-input label="Standalone" clearable value="50" action-button-style="standalone"></ae-number-input>
```

### `clearable` / `resettable`

```html
<ae-number-input label="Clearable" clearable value="50"></ae-number-input>
<ae-number-input label="Resettable" resettable value="50" default-value="50"></ae-number-input>
```

### Listening to `change`

```html
<ae-number-input id="qty-input" label="Quantity" placeholder="Enter quantity"></ae-number-input>

<script type="module">
  import 'aeico-components/number-input';
  document.querySelector('#qty-input').addEventListener('change', (e) => {
    console.log('Value:', e.detail.value); // number
  });
</script>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | — | Field label displayed above the input. |
| `placeholder` | `string` | — | Placeholder text shown when the input is empty. |
| `value` | `number` | — | Controlled input value. |
| `defaultValue` | `number` | — | Uncontrolled initial value. |
| `min` | `number` | — | Minimum allowed value. |
| `max` | `number` | — | Maximum allowed value. |
| `step` | `number` | — | Increment step for the input. |
| `disabled` | `boolean` | `false` | Disables the input. |
| `required` | `boolean` | `false` | Marks the field as required in a form. |
| `controls` | `boolean` | `false` | Shows increment / decrement stepper buttons. |
| `clearable` | `boolean` | `false` | Shows a clear button when the input has a value. |
| `resettable` | `boolean` | `false` | Shows a reset button to restore the default value. |
| `actionButtonStyle` | `'integrated' \| 'standalone'` | `'integrated'` | Display style for clear/reset buttons. `integrated` attaches them to the input; `standalone` shows them as separate rounded icons. |
| `helperText` | `string` | — | Helper text displayed below the input. |
| `error` | `string` | — | Error message displayed below the input. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ value: number, oldValue: number, action: string }` | Fired when the input value changes. |

## CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--input-field-gap` | Gap between the label and the input (default `4px`). |
| `--input-font-size` | Input text font size. |
| `--input-padding` | Input internal padding. |
| `--input-border-width` | Border thickness. |
| `--input-border-radius` | Corner radius. |
| `--ae-border-subtle` | Default border colour. |
| `--ae-border-default` | Border colour on hover. |
| `--ae-border-focus` | Border colour when focused. |
| `--ae-surface-base` | Background colour. |
| `--ae-surface-raised` | Background colour on hover. |
| `--ae-surface-raised` | Background colour when focused. |
| `--ae-color-text-muted` | Text colour. |
| `--ae-color-text-disabled` | Placeholder text colour. |
| `--input-transition` | CSS transition applied to border and background. |
