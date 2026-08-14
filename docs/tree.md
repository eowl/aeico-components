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

### `showLine` - connector lines

```html
<ae-tree showLine defaultExpandAll>
  <ae-tree-item key="root" label="Root">
    <ae-tree-item key="child1" slot="sub">Child 1</ae-tree-item>
    <ae-tree-item key="child2" slot="sub">
      <ae-tree-item slot="sub" key="grandchild">Grandchild</ae-tree-item>
      Child 2
    </ae-tree-item>
  </ae-tree-item>
</ae-tree>
```

### `icon` - default expand icon name

```html
<ae-tree icon="folder">
  <ae-tree-item key="src" label="src/">
    <ae-tree-item key="main" slot="sub">main.ts</ae-tree-item>
  </ae-tree-item>
</ae-tree>
```

### `ae-tree-item` with `icon`

```html
<ae-tree defaultExpandAll>
  <ae-tree-item key="src" label="src/" icon="folder-open">
    <ae-tree-item key="main" slot="sub" icon="file-code">main.ts</ae-tree-item>
    <ae-tree-item key="utils" slot="sub" icon="file-code">utils.ts</ae-tree-item>
  </ae-tree-item>
</ae-tree>
```

### `disabled` item

```html
<ae-tree>
  <ae-tree-item key="active">Active Item</ae-tree-item>
  <ae-tree-item key="locked" disabled>Locked Item</ae-tree-item>
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
| `showLine` | `boolean` | `false` | Renders dashed connector lines between parent and children. |
| `defaultExpandAll` | `boolean` | `false` | Expands all parent nodes on mount. |
| `wrapText` | `boolean` | `false` | Allows item text to wrap to the next line instead of being truncated with an ellipsis. |
| `selectedKey` | `string` | - | Convenience prop to set an initially selected key. |
| `icon` | `string` | - | Default icon name used as the expand/collapse indicator. |

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
| `icon` | `string` | - | Icon name displayed before the label. |
| `disabled` | `boolean` | `false` | Prevents the item from being selected, checked, or expanded. |
| `expanded` | `boolean` | `false` | Controls the expanded state of a parent item. |
| `selected` | `boolean` | `false` | Marks the item as selected (usually managed by `ae-tree`). |
| `checked` | `boolean` | `false` | Marks the item as checked (usually managed by `ae-tree`). |
| `indeterminate` | `boolean` | `false` | JS-only. Sets the checkbox to an indeterminate (tri-state) state. |

## `ae-tree-item` Slots

| Name | Description |
|------|-------------|
| (default) | Label text content for the item. |
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
| `--tree-item-line-color` | Colour of connector lines when `showLine` is set. |
| `--tree-item-expand-size` | Size of the expand/collapse toggle icon (default `1rem`). |
