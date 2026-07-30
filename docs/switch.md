# Switch

`Form` `Input`

A toggle switch for binary on/off settings. Designed for options that take immediate effect (as opposed to a form checkbox that requires a submit action).

## Import

```js
import 'aeico-components/switch';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-switch>Enable notifications</ae-switch>
```

### `checked` - controlled state

```html
<ae-switch checked>Dark mode</ae-switch>
```

### `defaultChecked` - uncontrolled initial state

```html
<ae-switch defaultChecked>Auto-save</ae-switch>
```

### `label` attribute

```html
<ae-switch label="Receive marketing emails"></ae-switch>
```

### `disabled`

```html
<ae-switch checked disabled>Managed by admin</ae-switch>
```

### Custom toggle dimensions

```html
<ae-switch style="--toggle-width: 48px; --toggle-height: 26px; --toggle-slider-size: 20px;" checked>
  Custom size
</ae-switch>
```

### Custom colours

```html
<ae-switch
  checked
  style="--toggle-bg-checked: #9333ea; --toggle-bg: #e5e7eb;">
  Purple toggle
</ae-switch>
```

### Listening to `change`

```html
<ae-switch id="sw">Enable feature</ae-switch>

<script type="module">
  import 'aeico-components/switch';
  document.querySelector('#sw').addEventListener('change', (e) => {
    console.log('Checked:', e.detail.checked);
  });
</script>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `checked` | `boolean` | `false` | Current checked state (controlled). |
| `defaultChecked` | `boolean` | `false` | Initial checked state (uncontrolled). |
| `label` | `string` | - | Label text. Prefer the default slot for rich HTML labels. |
| `disabled` | `boolean` | `false` | Disables the switch. |

## Slots

| Name | Description |
|------|-------------|
| (default) | Label content placed next to the toggle. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ checked: boolean, oldChecked: boolean, action: string }` | Fired whenever the switch is toggled. |

## CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--toggle-width` | Width of the toggle container. |
| `--toggle-height` | Height of the toggle container. |
| `--toggle-slider-size` | Diameter of the thumb/knob. |
| `--toggle-gap` | Gap between the thumb and the container edges. |
| `--toggle-border-radius` | Border radius of the container. |
| `--toggle-bg` | Background colour when unchecked. |
| `--toggle-bg-checked` | Background colour when checked. |
| `--toggle-slider-bg` | Thumb background colour. |
| `--toggle-transition` | Transition timing for the animation. |
| `--switch-field-gap` | Gap between the toggle and the label. |
