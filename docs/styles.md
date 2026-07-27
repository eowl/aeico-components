# Styles

`Utilities`

Light DOM utility stylesheets for layout, spacing, border-radius, and design tokens. These are standalone CSS files — not Web Components — imported into your page's light DOM.

## Import

Import the stylesheets you need. `variables.css` provides the design tokens that `layout.css` and `radius.css` depend on:

```js
// Design tokens (colours, spacing, radii, fonts)
import 'aeico-components/styles/variables.css'

// Layout utilities (container, stack, cluster, grid, flank, split, frame, gap)
import 'aeico-components/styles/layout.css'

// Border-radius utilities
import 'aeico-components/styles/radius.css'
```

---

## variables.css — Design Tokens

Defines all CSS custom properties on `:root` and `:host` so they are available in both light DOM and Shadow DOM. Includes:

- **Colour palette**: `--ae-blue`, `--ae-green`, `--ae-red`, `--ae-yellow`, `--ae-cyan`, `--ae-gray`, `--ae-slate`, `--ae-dark`, `--ae-light` and their 100–900 tints
- **Semantic colours**: `--ae-color-primary`, `--ae-color-success`, `--ae-color-danger`, `--ae-color-warning`, `--ae-color-info`, `--ae-color-secondary`
- **Text colours**: `--ae-color-text-main`, `--ae-color-text-muted`, `--ae-color-text-link`, `--ae-color-text-disabled`
- **Surface colours**: `--ae-surface-base`, `--ae-surface-raised`, `--ae-surface-sunken`, `--ae-surface-overlay`
- **Border colours**: `--ae-border-subtle`, `--ae-border-default`, `--ae-border-hover`, `--ae-border-focus`
- **Border-radius scale**: `--ae-radius-square`, `--ae-radius-xs`, `--ae-radius-sm`, `--ae-radius-md`, `--ae-radius-lg`, `--ae-radius-xl`, `--ae-radius-pill`, `--ae-radius-circle`
- **Font stacks**: `--ae-font-sans-serif`, `--ae-font-monospace`
- **Size scale**: `--ae-size-base`, `--ae-size-xl` through `--ae-size-3xs`
- **Focus rings**: `--ae-focus-ring`, `--ae-focus-ring-sm`
- **Overlay**: `--ae-color-overlay`

### Light / dark theme

Tokens automatically adapt to `theme="dark"` on `<html>`:

```html
<html theme="dark">
```

Override any token on `:root` to customise the entire page:

```css
:root {
  --ae-color-primary: #ff6600;
  --ae-border-radius: 0; /* make all components square */
}
```

The `--ae-border-radius` hook allows setting a single border-radius value that propagates to all components. Set it to `initial` on a component to restore its default.

---

## layout.css — Layout Utilities

All layout classes live in `@layer aeico-layout`, so your own un-layered styles always take precedence without `!important`.

### Container

Centered, fixed-width containers with responsive padding.

```html
<div class="container">Default (1280px max)</div>
<div class="container-sm">Small (720px max)</div>
<div class="container-md">Medium (960px max)</div>
<div class="container-xl">Extra large (1440px max)</div>
<div class="container-fluid">Full width with padding</div>
```

Override max-widths globally:

```css
:root {
  --container-max-width: 960px;
  --container-padding-x: 2rem;
}
```

### Stack

Vertical flex layout with consistent gap. Children margin is reset to prevent unwanted spacing.

```html
<div class="stack">
  <h2>Title</h2>
  <p>Paragraph text…</p>
  <ae-button>Action</ae-button>
</div>
```

**Gap modifiers**: `.stack-1`, `.stack-2`, `.stack-3`, `.stack-4` (default), `.stack-6`, `.stack-8`, `.stack-10`, `.stack-12`, `.stack-16`

**Alignment modifiers**: `.stack-center`, `.stack-start`, `.stack-end`, `.stack-stretch`

```html
<div class="stack stack-2 stack-center">
  <ae-icon name="check"></ae-icon>
  <span>Success</span>
</div>
```

Override gap per instance:

```css
.my-section {
  --stack-gap: var(--space-6);
}
```

### Cluster

Horizontal flex layout with wrapping. Items flow left-to-right and wrap when needed.

```html
<div class="cluster">
  <ae-tag>Tag 1</ae-tag>
  <ae-tag>Tag 2</ae-tag>
  <ae-tag>Tag 3</ae-tag>
</div>
```

**Gap modifiers**: `.cluster-1` through `.cluster-16` (same scale as Stack)

**Justify modifiers**: `.cluster-between`, `.cluster-center`, `.cluster-end`

```html
<header class="cluster cluster-between">
  <h1>Logo</h1>
  <nav class="cluster cluster-2">
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>
```

Override alignment inline:

```html
<div class="cluster" style="--cluster-align: flex-start; --cluster-justify: center">
  …
</div>
```

### Grid

CSS Grid with fixed or auto-responsive columns.

**Fixed columns**:

```html
<div class="grid grid-cols-3">
  <ae-card>1</ae-card>
  <ae-card>2</ae-card>
  <ae-card>3</ae-card>
</div>
```

Presets: `.grid-cols-2`, `.grid-cols-3`, `.grid-cols-4`, `.grid-cols-6`, `.grid-cols-12`

**Responsive columns** — change at breakpoints:

```html
<div class="grid grid-cols-1 grid-cols-md-2 grid-cols-lg-3">
  …
</div>
```

Breakpoints: `-sm-` (≥576px), `-md-` (≥768px), `-lg-` (≥992px), `-xl-` (≥1200px)

**Auto-responsive** — fills as many columns as fit:

```html
<div class="grid-auto" style="--grid-min-col: 250px">
  …
</div>
```

**Full-width span** — child spans all columns:

```html
<div class="grid grid-cols-3">
  <div class="grid-span">Full width header</div>
  <div>A</div>
  <div>B</div>
  <div>C</div>
</div>
```

Override gap:

```css
.my-grid {
  --grid-gap: var(--space-6);
}
```

### Flank

Two-column layout: one side fixed/intrinsic width, the other fills remaining space. Wraps to single column on narrow screens.

```html
<div class="flank" style="--flank-size: 12rem">
  <img src="avatar.png" alt="Avatar" />
  <div>
    <h3>Title</h3>
    <p>Content that fills the remaining space…</p>
  </div>
</div>
```

**`.flank-end`** — last child is the flank instead of first.

Custom properties:

| Property | Default | Description |
|----------|---------|-------------|
| `--flank-size` | `auto` | Width of the flank element |
| `--flank-content-min` | `50%` | Minimum width of content before wrapping |
| `--flank-gap` | `var(--space-4)` | Gap between children |

### Split

Horizontal space-between layout — ideal for toolbars, card headers, and navigation bars.

```html
<header class="split">
  <span>Page Title</span>
  <nav class="cluster cluster-2">
    <ae-button variant="subtle">Edit</ae-button>
    <ae-button variant="subtle">Delete</ae-button>
  </nav>
</header>
```

**`.split-col`** — vertical split (flex-direction: column).

Override gap:

```css
.my-header {
  --split-gap: var(--space-2);
}
```

### Frame

Aspect-ratio container that crops content (images, videos) without distortion.

```html
<div class="frame frame-landscape">
  <img src="hero.jpg" alt="Hero image" />
</div>
```

Presets: `.frame-square` (1:1), `.frame-landscape` (16:9, default), `.frame-portrait` (9:16)

Custom ratio:

```html
<div class="frame" style="--frame-ratio: 4 / 3">
  <img src="photo.jpg" alt="4:3 photo" />
</div>
```

### Gap Utilities

Apply to any flex or grid container:

```html
<div class="cluster gap-2">…</div>
<div class="stack gap-y-6">…</div>
```

Available steps: `0`, `1`, `2`, `3`, `4`, `6`, `8`, `10`, `12`, `16`

| Class | Applies |
|-------|---------|
| `.gap-{n}` | Row and column gap |
| `.gap-x-{n}` | Column gap only |
| `.gap-y-{n}` | Row gap only |

### Spacing Tokens

Defined on `:root` by `layout.css` (mirrored in `variables.css`):

| Token | Value |
|-------|-------|
| `--space-1` | 0.25rem (4px) |
| `--space-2` | 0.5rem (8px) |
| `--space-3` | 0.75rem (12px) |
| `--space-4` | 1rem (16px) |
| `--space-6` | 1.5rem (24px) |
| `--space-8` | 2rem (32px) |
| `--space-10` | 2.5rem (40px) |
| `--space-12` | 3rem (48px) |
| `--space-16` | 4rem (64px) |

---

## radius.css — Border-Radius Utilities

Apply border-radius to any element. Lives in `@layer aeico-radius`.

```html
<div class="ae-radius-lg">Rounded corners</div>
<ae-card class="ae-radius-pill">Pill shape</ae-card>
<img class="ae-radius-circle" src="avatar.png" alt="Avatar" />
```

| Class | Value |
|-------|-------|
| `.ae-radius-square` | `0` |
| `.ae-radius-xs` | `2px` |
| `.ae-radius-sm` | `4px` |
| `.ae-radius-md` | `6px` |
| `.ae-radius-lg` | `8px` |
| `.ae-radius-xl` | `12px` |
| `.ae-radius-pill` | `999px` |
| `.ae-radius-circle` | `50%` |
