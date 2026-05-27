# Textarea

`Form` `Input`

A multi-line text input. Supports auto-resize (grows and shrinks to fit its content), character count limits, and configurable resize handles.

## Import

```js
import 'aeico-components/textarea';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-textarea label="Message" placeholder="Write your message here…"></ae-textarea>
```

### `rows` — initial visible height

```html
<ae-textarea label="Short note" rows="2" placeholder="Two rows"></ae-textarea>
<ae-textarea label="Long text"  rows="8" placeholder="Eight rows"></ae-textarea>
```

### `autoResize` — grows to fit content

```html
<ae-textarea label="Bio" autoResize placeholder="It will grow as you type…"></ae-textarea>
```

### `maxlength`

```html
<ae-textarea label="Tweet" maxlength="280" placeholder="Max 280 characters"></ae-textarea>
```

### `minlength`

```html
<ae-textarea label="Description" minlength="50" placeholder="At least 50 characters required"></ae-textarea>
```

### `resize`

```html
<ae-textarea label="No resize"         resize="none"       placeholder="Cannot resize"></ae-textarea>
<ae-textarea label="Vertical only"     resize="vertical"   placeholder="Vertical resize (default)"></ae-textarea>
<ae-textarea label="Horizontal only"   resize="horizontal" placeholder="Horizontal resize"></ae-textarea>
<ae-textarea label="Both directions"   resize="both"       placeholder="Both directions"></ae-textarea>
```

### `value` — controlled state

```html
<ae-textarea label="Notes" value="Preloaded content here."></ae-textarea>
```

### `disabled`

```html
<ae-textarea label="Locked" value="Read-only content." disabled></ae-textarea>
```

### Custom appearance via CSS variables

```html
<ae-textarea
  label="Custom"
  placeholder="Custom styled"
  style="
    --textarea-border-radius: 12px;
    --textarea-border-color: #9333ea;
    --textarea-border-color-focus: #7c3aed;
  ">
</ae-textarea>
```

### Listening to `change`

```html
<ae-textarea id="msg" label="Message" placeholder="Type here"></ae-textarea>

<script type="module">
  import 'aeico-components/textarea';
  document.querySelector('#msg').addEventListener('change', (e) => {
    console.log('Value:', e.detail.value);
  });
</script>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | — | Field label displayed above the textarea. |
| `placeholder` | `string` | — | Placeholder text shown when the textarea is empty. |
| `rows` | `number` | `3` | Number of visible text rows (initial height). |
| `maxlength` | `number` | — | Maximum number of characters allowed. |
| `minlength` | `number` | — | Minimum number of characters required. |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | Controls the CSS `resize` handle. Has no effect when `autoResize` is set. |
| `autoResize` | `boolean` | `false` | Automatically grows/shrinks the textarea to fit its content. |
| `value` | `string` | — | Controlled textarea value. |
| `disabled` | `boolean` | `false` | Disables the textarea. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ value: string }` | Fired when the textarea value changes. |

## CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--textarea-font-size` | Font size inside the textarea. |
| `--textarea-padding` | Internal padding. |
| `--textarea-border-width` | Border thickness. |
| `--textarea-border-radius` | Corner radius. |
| `--textarea-border-color` | Default border colour. |
| `--textarea-border-color-hover` | Border colour on hover. |
| `--textarea-border-color-focus` | Border colour when focused. |
| `--textarea-bg` | Background colour. |
| `--textarea-bg-hover` | Background colour on hover. |
| `--textarea-bg-focus` | Background colour when focused. |
| `--textarea-color` | Text colour. |
| `--textarea-placeholder-color` | Placeholder text colour. |
| `--textarea-transition` | CSS transition applied to border and background. |
