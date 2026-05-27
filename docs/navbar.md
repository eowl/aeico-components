# Navbar

`Navigation` `Layout`

A top navigation bar with brand, main links, and end actions zones. Includes a built-in responsive hamburger menu for mobile viewports.

## Import

```js
import 'aeico-components/navbar';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-navbar>
  <a slot="brand" href="/">MyApp</a>
  <a slot="start" href="/" aria-current="page">Home</a>
  <a slot="start" href="/about">About</a>
  <a slot="start" href="/blog">Blog</a>
  <ae-button slot="end" size="sm" color="primary">Sign In</ae-button>
</ae-navbar>
```

### `color`

```html
<ae-navbar color="primary">
  <a slot="brand" href="/">Primary Navbar</a>
</ae-navbar>

<ae-navbar color="dark">
  <a slot="brand" href="/">Dark Navbar</a>
</ae-navbar>
```

### `appearance`

```html
<!-- text: hover applies text-colour change only (default) -->
<ae-navbar appearance="text">
  <a slot="brand" href="/">Text mode</a>
  <a slot="start" href="/">Home</a>
</ae-navbar>

<!-- block: hover adds a background highlight -->
<ae-navbar appearance="block">
  <a slot="brand" href="/">Block mode</a>
  <a slot="start" href="/">Home</a>
</ae-navbar>
```

### `sticky`

```html
<ae-navbar sticky>
  <a slot="brand" href="/">Sticky Navbar</a>
</ae-navbar>
```

### With dropdown in end slot

```html
<ae-navbar color="primary">
  <a slot="brand" href="/">MyApp</a>
  <a slot="start" href="/">Home</a>
  <ae-dropdown slot="end">
    <ae-button slot="trigger" variant="subtle" size="sm">Account ▾</ae-button>
    <ae-dropdown-item href="/profile">Profile</ae-dropdown-item>
    <ae-dropdown-item value="logout">Sign Out</ae-dropdown-item>
  </ae-dropdown>
</ae-navbar>
```

### Custom CSS variables

```html
<ae-navbar style="
  --ae-navbar-height: 56px;
  --ae-navbar-bg: #0f172a;
  --ae-navbar-link-color: #94a3b8;
  --ae-navbar-link-hover-color: #f8fafc;
  --ae-navbar-link-hover-bg: rgba(255,255,255,0.05);
">
  <a slot="brand" href="/">Custom Navbar</a>
  <a slot="start" href="/">Home</a>
</ae-navbar>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark'` | `'default'` | Background colour theme. |
| `appearance` | `'text' \| 'block'` | `'text'` | Link hover style: text-colour-only or block-highlight. |
| `sticky` | `boolean` | `false` | Sticks the navbar to the top of the viewport on scroll. |
| `open` | `boolean` | `false` | Reflects the mobile menu expanded state. |

## Slots

| Name | Description |
|------|-------------|
| `brand` | Logo or site name; placed at the far left. |
| `start` | Main navigation links; placed after `brand`. |
| `end` | Secondary actions (buttons, dropdowns); placed at the far right. |

## CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--ae-navbar-height` | Height of the navbar. |
| `--ae-navbar-radius` | Border radius of the navbar (default `0`). |
| `--ae-navbar-bg` | Background colour. |
| `--ae-navbar-color` | Default text colour. |
| `--ae-navbar-border-width` | Bottom border thickness. |
| `--ae-navbar-border-color` | Bottom border colour. |
| `--ae-navbar-shadow` | Box shadow. |
| `--ae-navbar-padding-x` | Horizontal padding. |
| `--ae-navbar-gap` | Gap between flex sections. |
| `--ae-navbar-link-color` | Link text colour. |
| `--ae-navbar-link-font-size` | Link font size. |
| `--ae-navbar-link-padding-x` | Link horizontal padding. |
| `--ae-navbar-link-radius` | Link border radius. |
| `--ae-navbar-link-hover-color` | Link colour on hover. |
| `--ae-navbar-link-hover-bg` | Link background on hover. |
| `--ae-navbar-link-active-color` | Active link colour. |
| `--ae-navbar-link-active-font-weight` | Active link font weight. |
| `--ae-navbar-start-gap` | Gap between items in the `start` slot. |
| `--ae-navbar-end-gap` | Gap between items in the `end` slot. |
| `--ae-navbar-mobile-bg` | Mobile menu panel background. |
| `--ae-navbar-mobile-shadow` | Mobile menu panel shadow. |
| `--ae-navbar-hamburger-size` | Hamburger button size. |
| `--ae-navbar-hamburger-color` | Hamburger icon colour. |
