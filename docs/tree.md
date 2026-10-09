# Tree

`Data` `Display`

A hierarchical tree view for displaying nested data. Supports single/multi-select, checkbox mode, expand/collapse, and connector lines.

Includes two components: `ae-tree` (container) and `ae-tree-item` (each node).

## Import

```js
import 'aeico-components/tree';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-tree>
  <ae-tree-item key="docs" label="Documents">
    <ae-tree-item key="resume" slot="sub">Resume.pdf</ae-tree-item>
    <ae-tree-item key="cover"  slot="sub">CoverLetter.docx</ae-tree-item>
  </ae-tree-item>
  <ae-tree-item key="photos" label="Photos">
    <ae-tree-item key="img1" slot="sub">IMG_001.jpg</ae-tree-item>
    <ae-tree-item key="img2" slot="sub">IMG_002.jpg</ae-tree-item>
  </ae-tree-item>
  <ae-tree-item key="readme">README.md</ae-tree-item>
</ae-tree>
```

### `defaultExpandAll`

```html
<ae-tree defaultExpandAll>
  <ae-tree-item key="a" label="Section A">
    <ae-tree-item key="a1" slot="sub">Item A1</ae-tree-item>
    <ae-tree-item key="a2" slot="sub">Item A2</ae-tree-item>
  </ae-tree-item>
</ae-tree>
```

### `selectedKey` - pre-selected item

```html
<ae-tree selectedKey="a1">
  <ae-tree-item key="a" label="Section A">
    <ae-tree-item key="a1" slot="sub">Item A1 (selected)</ae-tree-item>
    <ae-tree-item key="a2" slot="sub">Item A2</ae-tree-item>
  </ae-tree-item>
</ae-tree>
```

### `multiple` - multi-select on click

```html
<ae-tree multiple>
  <ae-tree-item key="1">Item 1</ae-tree-item>
  <ae-tree-item key="2">Item 2</ae-tree-item>
  <ae-tree-item key="3">Item 3</ae-tree-item>
</ae-tree>
```

### `checkable` - checkbox selection

```html
<ae-tree checkable defaultExpandAll>
  <ae-tree-item key="fruits" label="Fruits">
    <ae-tree-item key="apple"  slot="sub">Apple</ae-tree-item>
    <ae-tree-item key="banana" slot="sub">Banana</ae-tree-item>
  </ae-tree-item>
  <ae-tree-item key="vegs" label="Vegetables">
    <ae-tree-item key="carrot" slot="sub">Carrot</ae-tree-item>
  </ae-tree-item>
</ae-tree>
```

### `indent-line` - guide lines

Two line styles are available:

- `indent-line="dashed"`: dashed connector lines under the expand toggle center
- `indent-line="solid"`: same position, solid line

```html
<ae-tree indent-line="dashed" defaultExpandAll>
  <ae-tree-item key="root" label="Root">
    <ae-tree-item key="child1" slot="sub">Child 1</ae-tree-item>
    <ae-tree-item key="child2" slot="sub">
      <ae-tree-item slot="sub" key="grandchild">Grandchild</ae-tree-item>
      Child 2
    </ae-tree-item>
  </ae-tree-item>
</ae-tree>
```

Set `indent-line="solid"` if you prefer a solid line style. Both styles share
the same geometry (under the expand toggle).

### `expand-icon` / `collapse-icon` - custom expand toggle icons

Set custom icons for the expand/collapse toggle. `expand-icon` is shown when the item is
collapsed; `collapse-icon` (optional) is shown when expanded. By default the tree uses the
built-in `_chevron-right` (collapsed) and `_chevron-down` (expanded) icons.

```html
<ae-tree expand-icon="chevron-right" collapse-icon="chevron-down">
  <ae-tree-item key="src" label="src/">
    <ae-tree-item key="main" slot="sub">main.ts</ae-tree-item>
  </ae-tree-item>
</ae-tree>
```

### Item icons - default slot vs `slot="icon"`

Icons placed directly in the item's default slot are part of the label content and inherit
the text color:

```html
<ae-tree-item key="favorites">
  <ae-icon name="star"></ae-icon> Favorites
</ae-tree-item>
```

To emphasize an icon as a control-style icon, use the `icon` slot instead. It renders after
the expand toggle (and checkbox) and before the label text, in a dimmer control-icon tone
with a fixed gap to the text:

```html
<ae-tree-item key="settings">
  <ae-icon name="settings" slot="icon"></ae-icon>Settings
</ae-tree-item>
```

### `disabled` item

```html
<ae-tree>
  <ae-tree-item key="active">Active Item</ae-tree-item>
  <ae-tree-item key="locked" disabled>Locked Item</ae-tree-item>
</ae-tree>
```

### `clickable` - click anywhere on an item row

By default, clicking a parent item's label selects it. Add the `clickable` attribute so that
clicking anywhere on an item row acts on it: parent (non-leaf) items expand/collapse, leaf
items are selected.

```html
<ae-tree clickable>
  <ae-tree-item key="docs" label="Documents">
    <ae-tree-item key="resume" slot="sub">Resume.pdf</ae-tree-item>
    <ae-tree-item key="cover" slot="sub">CoverLetter.docx</ae-tree-item>
  </ae-tree-item>
</ae-tree>
```

When a leaf item's label contains an `<a>` link, clicking anywhere on that row (outside the
link) follows the link instead of selecting the item.

```html
<ae-tree clickable>
  <ae-tree-item key="home">
    <a href="/home">Home</a>
  </ae-tree-item>
</ae-tree>
```

In `checkable` mode, clicking the label text toggles the checkbox instead of selecting. When
`checkable` and `clickable` are both set, clicking a parent's label text toggles the checkbox.
Because the label fills the row, a parent node can only be expanded/collapsed by clicking its
expand toggle (the triangle); clicking the row otherwise toggles the checkbox.

```html
<ae-tree checkable clickable>
  <ae-tree-item key="fruits" label="Fruits">
    <ae-tree-item key="apple" slot="sub">Apple</ae-tree-item>
    <ae-tree-item key="banana" slot="sub">Banana</ae-tree-item>
  </ae-tree-item>
</ae-tree>
```

### `wrap-text` - allow text to wrap

When the tree has a constrained width, long item text is truncated with an ellipsis by default
(items use `white-space: nowrap`). Add the `wrap-text` attribute to let text wrap to the next line.

```html
<ae-tree wrap-text>
  <ae-tree-item key="short">Short</ae-tree-item>
  <ae-tree-item key="long">This is a very long tree item text that will wrap to the next line</ae-tree-item>
</ae-tree>
```

### Listening to events

```html
<ae-tree id="tree1" checkable defaultExpandAll>
  <ae-tree-item key="a" label="Group A">
    <ae-tree-item key="a1" slot="sub">Item A1</ae-tree-item>
    <ae-tree-item key="a2" slot="sub">Item A2</ae-tree-item>
  </ae-tree-item>
</ae-tree>

<script type="module">
  import 'aeico-components/tree';
  const tree = document.querySelector('#tree1');

  tree.addEventListener('select', (e) => {
    console.log('Selected:', e.detail.key, 'All:', e.detail.selectedKeys);
  });
  tree.addEventListener('expand', (e) => {
    console.log('Expanded:', e.detail.key, e.detail.expanded);
  });
  tree.addEventListener('check', (e) => {
    console.log('Checked:', e.detail.key, 'All:', e.detail.checkedKeys);
  });
</script>
```

### Reading selected/checked keys from JavaScript

```js
const tree = document.querySelector('ae-tree');
console.log(tree.selectedKeys);  // string[]
console.log(tree.checkedKeys);   // string[]
console.log(tree.expandedKeys);  // string[]
```

---

## `ae-tree` Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `checkable` | `boolean` | `false` | Shows checkboxes on each item. Parent check state is automatically derived from children. |
| `multiple` | `boolean` | `false` | Allows multiple items to be selected by clicking (without checkboxes). |
| `indentLine` | `false \| 'solid' \| 'dashed'` | `false` | Guide lines under the expand toggle. `'dashed'` / `'solid'` select the line style. |
| `defaultExpandAll` | `boolean` | `false` | Expands all parent nodes on mount. |
| `wrapText` | `boolean` | `false` | Allows item text to wrap to the next line instead of being truncated with an ellipsis. |
| `selectedKey` | `string` | - | Convenience prop to set an initially selected key. |
| `expandIcon` | `string` | `'_chevron-right'` | Icon name shown on the expand toggle when collapsed. |
| `collapseIcon` | `string` | `'_chevron-down'` | Icon name shown on the expand toggle when expanded. Falls back to `expandIcon` (rotated) when omitted. |
| `iconPlacement` | `'start' \| 'end'` | `'start'` | Placement of the expand toggle icon: `'start'` (before the label) or `'end'` (after the label). |
| `clickable` | `boolean` | `false` | When true, clicking anywhere on an item row acts: parents expand/collapse, leaves are selected. In `checkable` mode, clicking the row toggles the checkbox instead, so parents only expand via the toggle triangle. |

## `ae-tree` JavaScript Properties (read/write)

| Property | Type | Description |
|----------|------|-------------|
| `selectedKeys` | `string[]` | Array of currently selected item keys. |
| `checkedKeys` | `string[]` | Array of currently checked item keys (requires `checkable`). |
| `expandedKeys` | `string[]` | Array of currently expanded parent item keys. |

## `ae-tree` Slots

| Name | Description |
|------|-------------|
| (default) | Top-level `<ae-tree-item>` elements. |

## `ae-tree` Events

| Event | Detail | Description |
|-------|--------|-------------|
| `select` | `{ key: string, selected: boolean, selectedKeys: string[] }` | Fired when an item's selected state changes. |
| `expand` | `{ key: string, expanded: boolean, expandedKeys: string[] }` | Fired when a parent item is expanded or collapsed. |
| `check` | `{ key: string, checked: boolean, checkedKeys: string[] }` | Fired when a checkbox item is checked or unchecked (requires `checkable`). |

---

## `ae-tree-item` Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `key` | `string` | auto-generated | Unique identifier. Auto-generated if omitted. |
| `label` | `string` | - | When set, the item is treated as a parent node that can expand/collapse. Sub-items go in the `sub` slot. |
| `disabled` | `boolean` | `false` | Prevents the item from being selected, checked, or expanded. |
| `expanded` | `boolean` | `false` | Controls the expanded state of a parent item. |
| `selected` | `boolean` | `false` | Marks the item as selected (usually managed by `ae-tree`). |
| `checked` | `boolean` | `false` | Marks the item as checked (usually managed by `ae-tree`). |
| `indeterminate` | `boolean` | `false` | JS-only. Sets the checkbox to an indeterminate (tri-state) state. |

## `ae-tree-item` Slots

| Name | Description |
|------|-------------|
| (default) | Label text content for the item. |
| `icon` | Optional item icon, rendered between the expand toggle and the label text. Gets a dimmer control-icon color and a gap to the text. |
| `sub` | Child `<ae-tree-item>` elements (sub-nodes). Requires the `label` attribute to be set on this item. |

## CSS Custom Properties

Set on `ae-tree` or a parent element; all `ae-tree-item` nodes inherit them.

| Property | Description |
|----------|-------------|
| `--ae-tree-indent` | Indentation per nesting level (default `1.25rem`). |
| `--tree-item-height` | Height of each row (default `2rem`). |
| `--tree-item-font-size` | Item font size (default `0.9375rem`). |
| `--tree-item-color` | Default item text colour. |
| `--tree-item-color-disabled` | Text colour for disabled items. |
| `--tree-item-bg-hover` | Background colour on hover. |
| `--tree-item-bg-selected` | Background colour of the selected item. |
| `--tree-item-color-selected` | Text colour of the selected item. |
| `--tree-item-line-color` | Colour of the guide lines when `indent-line` is set. |
| `--tree-item-expand-size` | Size of the expand/collapse toggle icon (default `1rem`). |
| `--tree-item-expand-color` | Color of the expand/collapse toggle icon. |
| `--tree-item-icon-gap` | Gap between a `slot="icon"` icon and the label text (default `0.375rem`). |
