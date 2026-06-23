# Checkbox

`Form` `Input`

A single checkbox for boolean input. Supports controlled (`checked`) and uncontrolled (`defaultChecked`) modes, a custom label slot, and the native form `required` constraint.

## Import

```js
import 'aeico-components/checkbox';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-checkbox>Accept terms and conditions</ae-checkbox>
```

### `checked` — controlled state

```html
<ae-checkbox checked>Pre-selected option</ae-checkbox>
```

### `defaultChecked` — uncontrolled default

```html
<ae-checkbox defaultChecked>Default on, user can toggle</ae-checkbox>
```

### `label` attribute

Use `label` as a shorthand when no rich HTML is needed in the label.

```html
<ae-checkbox label="Subscribe to newsletter"></ae-checkbox>
```

### `disabled`

```html
<ae-checkbox checked disabled>Locked option</ae-checkbox>
```

### `required`

```html
<form>
  <ae-checkbox required>I agree to the privacy policy</ae-checkbox>
  <ae-button type="submit">Submit</ae-button>
</form>
```

### `variant`

```html
<ae-checkbox variant="filled" checked>Filled variant</ae-checkbox>
```

### Listening to `change`

```html
<ae-checkbox id="notif">Enable notifications</ae-checkbox>

<script type="module">
  import 'aeico-components/checkbox';
  document.querySelector('#notif').addEventListener('change', (e) => {
    console.log('checked:', e.detail.checked);
  });
</script>
```

### Custom appearance via CSS variables

```html
<ae-checkbox
  style="--ae-color-solid: #9333ea; --checkbox-size: 20px;"
  checked
>
  Purple checkbox
</ae-checkbox>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `checked` | `boolean` | `false` | Current checked state (controlled). |
| `defaultChecked` | `boolean` | `false` | Initial checked state (uncontrolled). |
| `label` | `string` | — | Label text. Prefer the default slot for rich HTML labels. |
| `variant` | `string` | — | Visual variant. |
| `disabled` | `boolean` | `false` | Disables the checkbox. |
| `required` | `boolean` | `false` | Marks the field as required in a form. |

## Slots

| Name | Description |
|------|-------------|
| (default) | Label content. Rendered next to the checkbox indicator. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ checked: boolean, oldChecked: boolean, action: string }` | Fired whenever the checked state changes. |

## CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--checkbox-size` | Width and height of the checkbox indicator. |
| `--checkbox-border-width` | Thickness of the checkbox border. |
| `--checkbox-border-radius` | Corner radius of the checkbox indicator. |
| `--checkbox-border-color` | Border colour when unchecked. |
| `--checkbox-bg` | Background colour when unchecked. |
| `--ae-color-solid` | Fill/accent colour when checked. |
| `--checkbox-field-gap` | Gap between the checkbox indicator and the label. |
