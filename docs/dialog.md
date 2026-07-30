# Dialog

`Feedback` `Overlay`

A modal or modeless dialog for confirmations, forms, and detailed content. Opens and closes programmatically via `.open()` / `.close()` methods or the `open` attribute.

Any slotted child element that has a `data-close` attribute will automatically close the dialog when clicked.

## Import

```js
import 'aeico-components/dialog';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic modal

```html
<ae-dialog id="dlg" label="Confirm Delete">
  <p>Are you sure you want to delete this item? This action cannot be undone.</p>
  <div slot="footer">
    <ae-button color="danger" onclick="document.querySelector('#dlg').close()">Delete</ae-button>
    <ae-button variant="text" data-close>Cancel</ae-button>
  </div>
</ae-dialog>

<ae-button color="danger" onclick="document.querySelector('#dlg').open()">Delete</ae-button>
```

### `label` - dialog title

```html
<ae-dialog label="User Profile">
  <p>Edit your profile details below.</p>
</ae-dialog>
```

### `header` slot - custom header

```html
<ae-dialog>
  <div slot="header">
    <ae-icon name="settings"></ae-icon>
    Preferences
  </div>
  Dialog body.
</ae-dialog>
```

### `width` and `height`

```html
<ae-dialog label="Wide Dialog" width="800px">
  Wide content here.
</ae-dialog>

<ae-dialog label="Tall Dialog" width="500px" height="600px">
  Tall content here.
</ae-dialog>
```

### `modal="false"` - modeless dialog

```html
<ae-dialog id="modeless" label="Floating Panel" modal="false">
  This dialog does not block the rest of the page.
</ae-dialog>
```

### `closable="false"` - remove the close button

```html
<ae-dialog id="required" label="Required Action" closable="false">
  <p>You must complete this step before continuing.</p>
  <ae-button slot="footer" color="primary" data-close>I understand</ae-button>
</ae-dialog>
```

### `closeOnOverlayClick="false"` - prevent backdrop close

```html
<ae-dialog label="Sticky Dialog" closeOnOverlayClick="false">
  Clicking outside will not close this dialog.
</ae-dialog>
```

### `data-close` - elements that auto-close the dialog

```html
<ae-dialog label="Actions">
  Body content.
  <div slot="footer">
    <ae-button color="primary" data-close>OK</ae-button>
    <ae-button variant="text"  data-close>Cancel</ae-button>
  </div>
</ae-dialog>
```

### Programmatic control

```html
<ae-dialog id="prog-dlg" label="Programmatic">Content.</ae-dialog>

<script type="module">
  import 'aeico-components/dialog';
  const dlg = document.querySelector('#prog-dlg');

  document.querySelector('#open-btn').addEventListener('click', () => dlg.open());
  dlg.addEventListener('close', () => console.log('Dialog closed'));
</script>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | - | Title shown in the dialog header. |
| `width` | `string` | - | CSS width of the dialog panel (e.g. `'600px'`, `'80vw'`). |
| `height` | `string` | - | CSS height of the dialog panel. |
| `modal` | `boolean` | `true` | When `true`, renders a backdrop and traps focus. |
| `closable` | `boolean` | `true` | Shows the built-in close (×) button. |
| `header` | `boolean` | `true` | Shows the header bar. Set to `false` to hide it entirely. |
| `closeOnOverlayClick` | `boolean` | `true` | Closes the dialog when the user clicks the backdrop. |

## Slots

| Name | Description |
|------|-------------|
| (default) | Dialog body content. |
| `header` | Custom header content, replaces the built-in title bar. |
| `footer` | Footer area for action buttons. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `open` | - | Fired when the dialog opens. |
| `close` | - | Fired when the dialog closes. |
