# Select

`Form` `Input`

A dropdown picker for single or multiple selection. Options can be supplied via the `options` attribute (JSON array) or by slotting `<ae-select-option>` elements.

Includes two components: `ae-select` (the picker) and `ae-select-option` (individual options).

## Import

```js
import 'aeico-components/select';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic — string options

```html
<ae-select options='["Apple", "Banana", "Cherry"]' placeholder="Pick a fruit"></ae-select>
```

### Object options with value/label

```html
<ae-select
  placeholder="Select country"
  options='[
    { "value": "us", "label": "United States" },
    { "value": "gb", "label": "United Kingdom" },
    { "value": "de", "label": "Germany" }
  ]'>
</ae-select>
```

### Using `<ae-select-option>` slot children

```html
<ae-select placeholder="Choose a role">
  <ae-select-option value="admin">Administrator</ae-select-option>
  <ae-select-option value="editor">Editor</ae-select-option>
  <ae-select-option value="viewer">Viewer</ae-select-option>
</ae-select>
```

### `value` — controlled selection

```html
<ae-select value="gb" options='[
  { "value": "us", "label": "United States" },
  { "value": "gb", "label": "United Kingdom" }
]'></ae-select>
```

### `defaultValue` — uncontrolled initial value

```html
<ae-select
  defaultValue="editor"
  placeholder="Select role"
  options='[
    { "value": "admin",  "label": "Admin" },
    { "value": "editor", "label": "Editor" }
  ]'>
</ae-select>
```

### `multiple` — multi-select

```html
<ae-select multiple placeholder="Select tags" options='["Frontend", "Backend", "DevOps", "Design"]'></ae-select>
```

### `multiple` with `expandable` — collapsible tag list

```html
<ae-select multiple expandable placeholder="Select frameworks" options='["React", "Vue", "Angular", "Svelte"]'></ae-select>
```

### `position` — dropdown opens upward

```html
<ae-select position="top" placeholder="Opens up" options='["A", "B", "C"]'></ae-select>
```

### Disabled option

```html
<ae-select placeholder="Choose plan">
  <ae-select-option value="free">Free</ae-select-option>
  <ae-select-option value="pro">Pro</ae-select-option>
  <ae-select-option value="enterprise" disabled>Enterprise (contact us)</ae-select-option>
</ae-select>
```

### Listening to `change`

```html
<ae-select id="sel" options='["A", "B", "C"]' placeholder="Pick one"></ae-select>

<script type="module">
  import 'aeico-components/select';
  document.querySelector('#sel').addEventListener('change', (e) => {
    console.log('Value:', e.detail.value);
  });
</script>
```

### Custom appearance via CSS variables

```html
<ae-select
  placeholder="Custom"
  options='["X", "Y"]'
  style="
    --select-border-color: #9333ea;
    --select-border-color-focus: #7c3aed;
    --select-border-radius: 99px;
  ">
</ae-select>
```

---

## `ae-select` Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `options` | `string[] \| Array<{ value: string, label: string }>` | — | Option list. Can be a JSON string in HTML or a JS array. |
| `placeholder` | `string` | — | Placeholder text shown when nothing is selected. |
| `value` | `string \| string[]` | — | Controlled selected value(s). Use a JSON array string for multiple. |
| `defaultValue` | `string \| string[]` | — | Uncontrolled initial value(s). |
| `multiple` | `boolean` | `false` | Enables multi-select mode. |
| `expandable` | `boolean` | `false` | In multi-select mode, allows the selected-tag list to be collapsed/expanded. |
| `position` | `'top' \| 'bottom'` | `'bottom'` | Direction the dropdown panel opens. |

## `ae-select` Slots

| Name | Description |
|------|-------------|
| (default) | `<ae-select-option>` elements. These are merged with the `options` prop. |

## `ae-select` Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ value: string \| string[] }` | Fired when the selection changes. In multi-select mode, `value` is an array. |

## `ae-select` CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--select-field-gap` | Gap between the label and the select trigger (default `2px`). |
| `--select-font-size` | Trigger font size. |
| `--select-padding` | Trigger padding. |
| `--select-border-width` | Trigger border thickness. |
| `--select-border-radius` | Trigger corner radius. |
| `--select-border-color` | Default border colour. |
| `--select-border-color-hover` | Border colour on hover. |
| `--select-border-color-focus` | Border colour when focused. |
| `--select-bg` | Trigger background colour. |
| `--select-bg-hover` | Trigger background on hover. |
| `--select-bg-focus` | Trigger background when focused. |
| `--select-color` | Trigger text colour. |
| `--select-arrow-color` | Dropdown arrow icon colour. |
| `--select-arrow-size` | Dropdown arrow icon size (default `0.75em`). |
| `--select-transition` | CSS transition applied to border and background. |
| `--select-dropdown-bg` | Options panel background colour. |
| `--select-dropdown-border` | Options panel border. |
| `--select-dropdown-border-radius` | Options panel corner radius. |
| `--select-dropdown-shadow` | Options panel box shadow. |
| `--select-dropdown-max-height` | Max height of the options panel. |
| `--select-dropdown-z-index` | Stack order of the options panel. |

---

## `ae-select-option` Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string` | — | The option's value, emitted in the `change` event. |
| `label` | `string` | — | Display label in the trigger. Falls back to slot text content. |
| `disabled` | `boolean` | `false` | Makes the option non-selectable. |

## `ae-select-option` Slots

| Name | Description |
|------|-------------|
| (default) | Option label text shown in the dropdown list. |
