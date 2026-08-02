# Button Group

`General` `Interactive`

Groups multiple buttons (or dropdown buttons) into a single visual unit. Propagates shared `color`, `variant`, and `size` to all children automatically.

## Import

```js
import 'aeico-components/button-group';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-button-group>
  <ae-button>One</ae-button>
  <ae-button>Two</ae-button>
  <ae-button>Three</ae-button>
</ae-button-group>
```

### `color` and `variant` propagation

Setting `color` and `variant` on the group propagates to all child buttons.

```html
<ae-button-group color="primary" variant="outlined">
  <ae-button>Edit</ae-button>
  <ae-button>Duplicate</ae-button>
  <ae-button color="danger">Delete</ae-button>
</ae-button-group>
```

### `size`

```html
<ae-button-group color="primary" size="sm">
  <ae-button>SM</ae-button>
  <ae-button>SM</ae-button>
</ae-button-group>

<ae-button-group color="primary" size="lg">
  <ae-button>LG</ae-button>
  <ae-button>LG</ae-button>
</ae-button-group>
```

### `compact` - joined buttons

Removes gaps and joins button borders so the group looks like a single segmented control.

```html
<ae-button-group color="primary" variant="outlined" compact>
  <ae-button>Left</ae-button>
  <ae-button>Center</ae-button>
  <ae-button>Right</ae-button>
</ae-button-group>
```

### `block` - full-width

```html
<ae-button-group color="primary" block>
  <ae-button>A</ae-button>
  <ae-button>B</ae-button>
</ae-button-group>
```

### `vertical` - vertical stack

Stacks buttons vertically instead of side by side. Works with `compact`, `block`, and all other button-group props.

```html
<ae-button-group vertical color="primary">
  <ae-button>Top</ae-button>
  <ae-button>Middle</ae-button>
  <ae-button>Bottom</ae-button>
</ae-button-group>
```

```html
<ae-button-group vertical compact color="primary">
  <ae-button>Top</ae-button>
  <ae-button>Middle</ae-button>
  <ae-button>Bottom</ae-button>
</ae-button-group>
```

### `disabled` - disable all children

```html
<ae-button-group color="primary" disabled>
  <ae-button>Edit</ae-button>
  <ae-button>Delete</ae-button>
</ae-button-group>
```

### With dropdown buttons

```html
<ae-button-group color="primary" compact>
  <ae-button>Save</ae-button>
  <ae-dropdown-button>
    <ae-dropdown-item value="save-draft">Save as Draft</ae-dropdown-item>
    <ae-dropdown-item value="save-copy">Save a Copy</ae-dropdown-item>
  </ae-dropdown-button>
</ae-button-group>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark'` | - | Propagated to all child buttons. |
| `variant` | `'filled' \| 'outlined' \| 'faint' \| 'subtle' \| 'text'` | - | Propagated to all child buttons. |
| `size` | `'3xs' \| '2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg'` | - | Propagated to all child buttons. |
| `compact` | `boolean` | `false` | Removes gaps between buttons and joins their borders. |
| `block` | `boolean` | `false` | Makes the group full-width. |
| `vertical` | `boolean` | `false` | Stacks buttons vertically instead of horizontally. |
| `disabled` | `boolean` | `false` | Disables all child buttons. |

## Slots

| Name | Description |
|------|-------------|
| (default) | `<ae-button>` and/or `<ae-dropdown-button>` elements. |
