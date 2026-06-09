# Drawer

`Feedback` `Overlay`

A panel that slides in from any edge of the viewport. Backed by the native `<dialog>` element for built-in focus trapping, Escape key handling, and accessibility semantics.

Any slotted child element with a `data-close` attribute will automatically close the drawer when clicked.

## Import

```js
import 'aeico-components/drawer';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic drawer (right)

```html
<ae-drawer id="drawer" label="Settings">
  <p>Configure your preferences here.</p>
  <ae-button slot="footer" data-close>Cancel</ae-button>
  <ae-button slot="footer" color="primary">Save</ae-button>
</ae-drawer>

<ae-button onclick="document.querySelector('#drawer').open()">Open</ae-button>
```

### `placement` — which edge to open from

```html
<ae-drawer placement="left"   label="Left Drawer">...</ae-drawer>
<ae-drawer placement="right"  label="Right Drawer">...</ae-drawer>
<ae-drawer placement="top"    label="Top Drawer">...</ae-drawer>
<ae-drawer placement="bottom" label="Bottom Drawer">...</ae-drawer>
```

### `size` — control the opening dimension

For `left` / `right` placements, `size` sets the drawer width.
For `top` / `bottom` placements, `size` sets the drawer height.

```html
<ae-drawer label="Wide Drawer" size="520px">
  Wide content.
</ae-drawer>

<ae-drawer label="Bottom Sheet" placement="bottom" size="50vh">
  Bottom sheet content.
</ae-drawer>
```

### `label` — header title

```html
<ae-drawer label="User Profile">
  Edit your profile.
</ae-drawer>
```

### `header` slot — custom header

```html
<ae-drawer>
  <div slot="header">
    <ae-icon name="settings"></ae-icon>
    Preferences
  </div>
  Drawer body content.
</ae-drawer>
```

### `modal="false"` — no backdrop

```html
<ae-drawer id="panel" label="Side Panel" modal="false">
  The rest of the page stays interactive.
</ae-drawer>
```

### `closable="false"` — remove the close button

```html
<ae-drawer id="required" label="Required Step" closable="false">
  <p>Complete this step to continue.</p>
  <ae-button slot="footer" color="primary" data-close>Done</ae-button>
</ae-drawer>
```

### `header="false"` — no header

```html
<ae-drawer header="false">
  <p>Headerless content.</p>
  <ae-button slot="footer" data-close>Close</ae-button>
</ae-drawer>
```

### `closeOnOverlayClick="false"` — keep open on backdrop click

```html
<ae-drawer id="form-drawer" label="Edit Record" close-on-overlay-click="false">
  <p>Fill in the form below.</p>
  <ae-button slot="footer" data-close>Cancel</ae-button>
  <ae-button slot="footer" color="primary">Submit</ae-button>
</ae-drawer>
```

## API

### Properties / Attributes

| Property | Attribute | Type | Default | Description |
|---|---|---|---|---|
| `label` | `label` | `string` | — | Header title text |
| `placement` | `placement` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | Edge to open from |
| `size` | `size` | `string` | — | Width (left/right) or height (top/bottom) e.g. `'320px'` |
| `modal` | `modal` | `boolean` | `true` | Show modal backdrop with focus trap |
| `closable` | `closable` | `boolean` | `true` | Show close button in header |
| `header` | `header` | `boolean` | `true` | Show the header bar |
| `closeOnOverlayClick` | `close-on-overlay-click` | `boolean` | `true` | Close when backdrop is clicked |

### Slots

| Slot | Description |
|---|---|
| *(default)* | Drawer body content |
| `header` | Replaces the default label + close button |
| `footer` | Action buttons shown at the bottom |

### Methods

| Method | Returns | Description |
|---|---|---|
| `open()` | `void` | Opens the drawer |
| `close()` | `void` | Closes the drawer |
| `isOpen()` | `boolean` | Returns whether the drawer is currently open |

### Events

| Event | Detail | Description |
|---|---|---|
| `open` | `{ target: Drawer }` | Fired after the drawer opens |
| `close` | `{ target: Drawer }` | Fired after the drawer closes |

### CSS Custom Properties

| Property | Default | Description |
|---|---|---|
| `--ae-drawer-size` | `320px` | Fallback for the opening dimension when `size` prop is not set |
