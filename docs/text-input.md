# Text Input

`Form` `Input`

A single-line text input field. Wraps the native `<input>` element and exposes a consistent API. Supports all standard HTML input types via the `type` attribute.

## Import

```js
import 'aeico-components/text-input';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-text-input label="Username" placeholder="Enter your username"></ae-text-input>
```

### `type` — HTML input types

```html
<ae-text-input label="Email"    type="email"    placeholder="name@example.com"></ae-text-input>
<ae-text-input label="Password" type="password" placeholder="Enter password"></ae-text-input>
<ae-text-input label="Number"   type="number"   placeholder="0"></ae-text-input>
<ae-text-input label="Date"     type="date"></ae-text-input>
<ae-text-input label="Search"   type="search"   placeholder="Search…"></ae-text-input>
```

### `value` — controlled state

```html
<ae-text-input label="Name" value="Alice"></ae-text-input>
```

### `defaultValue` — uncontrolled initial value

```html
<ae-text-input label="Nickname" defaultValue="ace_dev"></ae-text-input>
```

### `required`

```html
<form>
  <ae-text-input label="Email" type="email" required placeholder="Required"></ae-text-input>
  <ae-button type="submit" color="primary">Submit</ae-button>
</form>
```

### `disabled`

```html
<ae-text-input label="Read-only field" value="Cannot edit" disabled></ae-text-input>
```

### Custom appearance via CSS variables

```html
<ae-text-input
  label="Custom"
  placeholder="Rounded"
  style="
    --input-border-radius: 99px;
    --ae-border-subtle: #9333ea;
    --ae-border-focus: #7c3aed;
  ">
</ae-text-input>
```

### `actionButtonStyle` — action button display style

```html
<!-- Integrated (default): buttons are attached to the input as one piece -->
<ae-text-input label="Integrated" clearable value="Hello" action-button-style="integrated"></ae-text-input>

<!-- Standalone: buttons are separate rounded icons -->
<ae-text-input label="Standalone" clearable value="Hello" action-button-style="standalone"></ae-text-input>
```

### Listening to `change`

```html
<ae-text-input id="name-input" label="Name" placeholder="Type here"></ae-text-input>

<script type="module">
  import 'aeico-components/text-input';
  document.querySelector('#name-input').addEventListener('change', (e) => {
    console.log('Value:', e.detail.value);
  });
</script>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | — | Field label displayed above the input. |
| `placeholder` | `string` | — | Placeholder text shown when the input is empty. |
| `type` | `string` | `'text'` | Native `<input>` type (e.g. `'email'`, `'password'`, `'number'`). |
| `value` | `string` | — | Controlled input value. |
| `defaultValue` | `string` | — | Uncontrolled initial value. |
| `disabled` | `boolean` | `false` | Disables the input. |
| `required` | `boolean` | `false` | Marks the field as required in a form. |
| `clearable` | `boolean` | `false` | Shows a clear button when the input has a value. |
| `resettable` | `boolean` | `false` | Shows a reset button to restore the default value. |
| `actionButtonStyle` | `'integrated' \| 'standalone'` | `'integrated'` | Display style for clear/reset buttons. `integrated` attaches them to the input; `standalone` shows them as separate rounded icons. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ value: string }` | Fired when the input value changes. |

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
