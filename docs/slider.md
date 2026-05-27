# Slider

`Form` `Input`

A range slider for selecting a numeric value. Supports discrete options (with labels), marks on the track, an editable number input, and a filled track from the origin.

## Import

```js
import 'aeico-components/slider';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-slider></ae-slider>
```

### `min`, `max`, `step`

```html
<ae-slider min="0" max="200" step="10"></ae-slider>
```

### `tracked` — fill from zero to current value

```html
<ae-slider min="0" max="100" tracked></ae-slider>
```

### `editable` — show a number input next to the slider

```html
<ae-slider min="0" max="100" editable></ae-slider>
```

### `marks="true"` — auto marks at endpoints

```html
<ae-slider min="0" max="100" step="25" marks></ae-slider>
```

### Custom marks with labels

```html
<ae-slider min="0" max="100" marks='[
  { "value": 0,   "label": "Low" },
  { "value": 50,  "label": "Mid" },
  { "value": 100, "label": "High" }
]'></ae-slider>
```

### `options` — discrete labelled options

```html
<ae-slider options='["XS", "S", "M", "L", "XL"]'></ae-slider>
```

### `options` with numeric values

```html
<ae-slider options='[
  { "label": "1 core",   "value": 1 },
  { "label": "2 cores",  "value": 2 },
  { "label": "4 cores",  "value": 4 },
  { "label": "8 cores",  "value": 8 }
]'></ae-slider>
```

### `percentage`

Appends `%` to the tooltip and editable input display.

```html
<ae-slider min="0" max="100" percentage editable></ae-slider>
```

### Custom colour via CSS variable

```html
<ae-slider min="0" max="100" tracked style="--color-solid: #9333ea;"></ae-slider>
```

### Listening to `change`

```html
<ae-slider id="vol" min="0" max="100"></ae-slider>

<script type="module">
  import 'aeico-components/slider';
  document.querySelector('#vol').addEventListener('change', (e) => {
    console.log('Value:', e.detail.value);
  });
</script>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `min` | `number` | `0` | Minimum numeric value. |
| `max` | `number` | `100` | Maximum numeric value. |
| `step` | `number` | `1` | Step increment between values. |
| `options` | `string[] \| Array<{ label: string, value: number \| string }>` | — | Discrete labelled options. When set, overrides `min`/`max`/`step`. |
| `percentage` | `boolean` | `false` | Appends `%` to labels and the editable input. |
| `editable` | `boolean` | `false` | Shows a number input field for direct value entry. |
| `tracked` | `boolean` | `false` | Fills the track from the start to the current value. |
| `marks` | `boolean \| Array<number \| { value: number, label?: string }>` | `false` | `true` for auto marks at endpoints/options; or an array of custom marks. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ value: number }` | Fired when the value changes. |

## CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--color-solid` | Thumb and filled track colour. Defaults to the primary theme colour. |
