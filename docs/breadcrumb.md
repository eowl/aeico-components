# Breadcrumb

`Navigation`

Displays the current page's location within a navigation hierarchy. The last item is automatically marked as the current page (`aria-current="page"`).

Includes two components: `ae-breadcrumb` (the container) and `ae-breadcrumb-item` (each individual crumb).

## Import

```js
import 'aeico-components/breadcrumb';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-breadcrumb>
  <ae-breadcrumb-item href="/">Home</ae-breadcrumb-item>
  <ae-breadcrumb-item href="/products">Products</ae-breadcrumb-item>
  <ae-breadcrumb-item>Laptop</ae-breadcrumb-item>
</ae-breadcrumb>
```

### `separator` - custom text separator

```html
<ae-breadcrumb separator=">">
  <ae-breadcrumb-item href="/">Home</ae-breadcrumb-item>
  <ae-breadcrumb-item href="/docs">Docs</ae-breadcrumb-item>
  <ae-breadcrumb-item>Getting Started</ae-breadcrumb-item>
</ae-breadcrumb>
```

### `separator` slot - custom element separator

The named `separator` slot takes priority over the `separator` attribute.

```html
<ae-breadcrumb>
  <ae-icon slot="separator" name="chevron-right" size="xs"></ae-icon>
  <ae-breadcrumb-item href="/">Home</ae-breadcrumb-item>
  <ae-breadcrumb-item href="/settings">Settings</ae-breadcrumb-item>
  <ae-breadcrumb-item>Profile</ae-breadcrumb-item>
</ae-breadcrumb>
```

### `color` - themed links

```html
<ae-breadcrumb color="primary">
  <ae-breadcrumb-item href="/">Home</ae-breadcrumb-item>
  <ae-breadcrumb-item>Current Page</ae-breadcrumb-item>
</ae-breadcrumb>
```

### `ae-breadcrumb-item` with `href`

When `href` is set the item renders as an `<a>` anchor; otherwise it renders as a `<span>`.

```html
<ae-breadcrumb>
  <ae-breadcrumb-item href="https://example.com">External</ae-breadcrumb-item>
  <ae-breadcrumb-item>No Link</ae-breadcrumb-item>
</ae-breadcrumb>
```

---

## `ae-breadcrumb` Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `separator` | `string` | `'/'` | Text character shown between items. Overridden by the `separator` slot. |
| `color` | `string` | - | Applies a theme colour to item links. |

## `ae-breadcrumb` Slots

| Name | Description |
|------|-------------|
| (default) | `<ae-breadcrumb-item>` elements. |
| `separator` | Custom element used as separator (overrides the `separator` attribute). |

---

## `ae-breadcrumb-item` Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `href` | `string` | - | When set, the item renders as an `<a>` anchor. |

## `ae-breadcrumb-item` Slots

| Name | Description |
|------|-------------|
| (default) | Crumb label text. |

## `ae-breadcrumb-item` CSS Parts

| Part | Description |
|------|-------------|
| `item` | The root wrapper element. |
| `label` | The label text element. |
| `link` | The `<a>` element (only when `href` is set). |
| `separator` | The separator element injected after the item. |
