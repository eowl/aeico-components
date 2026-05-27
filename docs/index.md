# Aeico Components

A library of Web Components built with the [Aeico](https://github.com/aeico/aeico) framework.

## Installation

```bash
npm install aeico-components
```

## Usage

Import individual components to keep your bundle small:

```js
import 'aeico-components/button';
import 'aeico-components/icon';
```

Or import everything at once:

```js
import 'aeico-components';
```

---

## Component Index

### General

| Component | Tag | Description |
|-----------|-----|-------------|
| [Button](./button.md) | `ae-button` | Triggers actions; supports variants, sizes, and icons. |
| [Button Group](./button-group.md) | `ae-button-group` | Groups buttons visually, including compact joined mode. |
| [Copy Button](./copy-button.md) | `ae-copy-button` | Copies text to clipboard with visual feedback. |
| [Icon](./icon.md) | `ae-icon` | Renders SVG icons from the built-in registry or custom sources. |
| [Icon Button](./icon-button.md) | `ae-icon-button` | ⚠️ Deprecated. Use `<ae-button>` with `<ae-icon>` instead. |

### Form & Input

| Component | Tag | Description |
|-----------|-----|-------------|
| [Checkbox](./checkbox.md) | `ae-checkbox` | Single checkbox for boolean input. |
| [Radio Group](./radio-group.md) | `ae-radio-group` | Single-choice selection in radio, button, or button-group mode. |
| [Select](./select.md) | `ae-select` | Dropdown picker supporting single and multiple selection. |
| [Slider](./slider.md) | `ae-slider` | Range slider with optional marks, labels, and editable input. |
| [Switch](./switch.md) | `ae-switch` | Toggle switch for on/off settings. |
| [Text Input](./text-input.md) | `ae-text-input` | Single-line text input supporting all HTML input types. |
| [Textarea](./textarea.md) | `ae-textarea` | Multi-line text area with optional auto-resize. |

### Navigation

| Component | Tag | Description |
|-----------|-----|-------------|
| [Breadcrumb](./breadcrumb.md) | `ae-breadcrumb` | Shows the current page's location in a navigation hierarchy. |
| [Dropdown](./dropdown.md) | `ae-dropdown` | Floating menu triggered by a custom element. |
| [Menu](./menu.md) | `ae-menu` | Multi-level navigation menu in flyout or inline mode. |
| [Navbar](./navbar.md) | `ae-navbar` | Page top navigation bar with mobile hamburger support. |
| [Pagination](./pagination.md) | `ae-pagination` | Page navigation for large data sets. |
| [Tabs](./tabs.md) | `ae-tabs` | Organises content into switchable tab panels. |

### Display

| Component | Tag | Description |
|-----------|-----|-------------|
| [Alert](./alert.md) | `ae-alert` | Contextual feedback messages with optional dismiss button. |
| [Badge](./badge.md) | `ae-badge` | Compact label for statuses, counts, or categories. |
| [Card](./card.md) | `ae-card` | Container with optional header and footer sections. |
| [Detail](./detail.md) | `ae-detail` | Expandable/collapsible content panel. |
| [Tag](./tag.md) | `ae-tag` | Inline label for annotation or filtering, with optional dismiss. |
| [Tree](./tree.md) | `ae-tree` | Hierarchical tree view with selection and checkbox support. |

### Feedback & Overlay

| Component | Tag | Description |
|-----------|-----|-------------|
| [Dialog](./dialog.md) | `ae-dialog` | Modal or modeless dialog for confirmations and forms. |
| [Progress Bar](./progress-bar.md) | `ae-progress-bar` | Visual indicator of operation progress. |
| [Tooltip](./tooltip.md) | `ae-tooltip` | Floating label shown on hover or click. |

### Layout

| Component | Tag | Description |
|-----------|-----|-------------|
| [Divider](./divider.md) | `ae-divider` | Horizontal or vertical separator line. |

---

## Common Patterns

### Color variants

Most components accept a `color` attribute with the following values:

`default` `primary` `secondary` `success` `danger` `warning` `info` `light` `dark`

### Size variants

Most components accept a `size` attribute:

`3xs` `2xs` `xs` `sm` `md` `lg`

### Visual variants

Button-like components accept a `variant` attribute:

`filled` `outlined` `faint` `subtle` `text`

### CSS Parts

Use `::part()` to style internal elements without Shadow DOM workarounds:

```css
ae-button::part(base) {
  border-radius: 0;
}
```

### CSS Custom Properties

Override component-level tokens directly on the element:

```css
ae-navbar {
  --ae-navbar-height: 56px;
  --ae-navbar-bg: #1a1a2e;
}
```
