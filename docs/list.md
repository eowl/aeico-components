# List

`Display`

A vertical list container (`ae-list`) for `ae-list-item` rows. Supports a
`bordered` variant and dividers between items via `divided` (rendered with
`ae-divider`). Items can be clicked to select (single-select), support hover
highlighting, and can carry a `prefix` icon slot, a `description` secondary
text line and a `disabled` state.

## Import

```js
import 'aeico-components/list';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-list>
  <ae-list-item key="a">Item A</ae-list-item>
  <ae-list-item key="b">Item B</ae-list-item>
  <ae-list-item key="c">Item C</ae-list-item>
</ae-list>
```

### `variant`

```html
<ae-list variant="bordered">
  <ae-list-item key="a">Item A</ae-list-item>
  <ae-list-item key="b">Item B</ae-list-item>
</ae-list>
```

### `divided`

Dividers are rendered between adjacent items; the first item gets none.

```html
<ae-list divided>
  <ae-list-item key="a">Item A</ae-list-item>
  <ae-list-item key="b">Item B</ae-list-item>
  <ae-list-item key="c">Item C</ae-list-item>
</ae-list>
```

### `description`

```html
<ae-list variant="bordered">
  <ae-list-item key="profile" description="Account settings and preferences">
    Profile
  </ae-list-item>
  <ae-list-item key="security" description="Password and two-factor authentication">
    Security
  </ae-list-item>
</ae-list>
```

### Prefix icon

```html
<ae-list>
  <ae-list-item key="user">
    <ae-icon name="user" slot="prefix"></ae-icon>
    Profile
  </ae-list-item>
  <ae-list-item key="settings">
    <ae-icon name="settings" slot="prefix"></ae-icon>
    Settings
  </ae-list-item>
</ae-list>
```

### `disabled`

```html
<ae-list divided>
  <ae-list-item key="a">Available</ae-list-item>
  <ae-list-item key="b" disabled>Unavailable</ae-list-item>
</ae-list>
```

### Selection

Click an item to select it (single-select). Clicking the selected item again
or another item updates the selection. The list emits a `select` event.

```html
<ae-list variant="bordered" id="list">
  <ae-list-item key="a">Item A</ae-list-item>
  <ae-list-item key="b">Item B</ae-list-item>
  <ae-list-item key="c">Item C</ae-list-item>
</ae-list>

<script>
  const list = document.getElementById('list');
  list.addEventListener('select', (e) => {
    console.log(e.detail.key, e.detail.selected, e.detail.selectedKeys);
  });
</script>
```

## Properties

### `ae-list`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | `'plain' \| 'bordered'` | `'plain'` | Visual style of the list container. |
| `divided` | `boolean` | `false` | Show dividers between adjacent items. |
| `selectedKey` | `string` | - | Currently selected item key (single-select). |

### `ae-list-item`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `key` | `string` | - | Unique identifier of the item. |
| `disabled` | `boolean` | `false` | Grey out the item and make it non-interactive. |
| `description` | `string` | - | Secondary text rendered below the main label. |
| `divided` | `boolean` | `false` | Show a divider above the item. Synced from the parent list. |
| `selected` | `boolean` | `false` | Whether the item is selected. Managed by the parent list. |

## Events

### `ae-list`

| Event | Detail | Description |
|-------|--------|-------------|
| `select` | `{ key: string, selected: boolean, selectedKeys: string[] }` | Fires when an item is selected or deselected. |

## Slots

### `ae-list-item`

| Name | Description |
|------|-------------|
| (default) | Main label content. |
| `prefix` | Icon or other content rendered before the label. |

## CSS Custom Properties

Override item layout and selection colors via tokens on `ae-list-item`:

| Token | Controls |
|-------|----------|
| `--list-item-padding-x` | Horizontal padding of an item. |
| `--list-item-height` | Minimum height of an item. |
| `--list-item-bg-hover` | Background on hover (non-selected). |
| `--list-item-bg-active` | Background when selected or pressed. |
| `--list-item-color-active` | Text color when selected or pressed. |

## CSS Parts

### `ae-list`

| Part | Description |
|------|-------------|
| `list` | The root list element. |

### `ae-list-item`

| Part | Description |
|------|-------------|
| `item` | The root item element. |
| `divider` | The divider line above the item. |
| `body` | The item content wrapper. |
| `row` | The label row (prefix + label). |
| `prefix` | The prefix slot wrapper. |
| `label` | The main label wrapper. |
| `description` | The secondary text line. |
