# ae-spinner

Animated loading indicator. Supports two visual styles: a rotating ring (`border`) and three bouncing dots (`dots`). Colour and size are driven by the shared design-token system.

## Import

```typescript
import 'aeico-components/spinner';
// or
import { Spinner } from 'aeico-components';
```

## Examples

```html
<!-- Border spinner (default) -->
<ae-spinner></ae-spinner>

<!-- Dots spinner -->
<ae-spinner variant="dots" color="primary" size="lg"></ae-spinner>

<!-- Custom speed with accessible label -->
<ae-spinner color="success" speed="0.5s" label="Saving…"></ae-spinner>

<!-- Inline with a button -->
<ae-button disabled>
  <ae-spinner size="xs" label="Loading…"></ae-spinner>
  Loading
</ae-button>
```

## Properties

| Property  | Attribute | Type                                                                                   | Default       | Description                                                                 |
|-----------|-----------|----------------------------------------------------------------------------------------|---------------|-----------------------------------------------------------------------------|
| `variant` | `variant` | `'border' \| 'dots'`                                                                   | `'border'`    | Visual style. `border` renders a spinning ring; `dots` renders three bouncing dots. |
| `size`    | `size`    | `'xs' \| 'sm' \| 'md' \| 'lg'`                                                        | `'md'`        | Size of the spinner.                                                        |
| `color`   | `color`   | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark'` | `'default'`   | Colour theme. Maps to the shared colour token system.                       |
| `label`   | `label`   | `string`                                                                               | `'Loading…'`  | Accessible label announced to screen-readers via `aria-label`.              |
| `speed`   | `speed`   | `string \| undefined`                                                                  | `undefined`   | Animation duration as a CSS time value, e.g. `"0.5s"` or `"800ms"`. Defaults to `0.75s` when unset. |

## CSS Custom Properties

| Property              | Default   | Description                                  |
|-----------------------|-----------|----------------------------------------------|
| `--spinner-size`      | `1.75em`  | Diameter of the spinner track.               |
| `--spinner-thickness` | `0.15em`  | Border width (border variant only).          |
| `--ae-color-solid`    | *(color token)* | Foreground / active colour.          |
| `--ae-color-bg-subtle`| *(color token)* | Background track colour (border variant). |
| `--spinner-speed`     | `0.75s`   | Animation duration. Also writable via the `speed` prop. |

## CSS Parts

| Part    | Description                                                              |
|---------|--------------------------------------------------------------------------|
| `track` | The outer ring element (border variant) or dots container (dots variant). |

## Accessibility

The host element has `role="status"` and `aria-label` set from the `label` prop. The inner track element is `aria-hidden="true"`. Animations are automatically paused when the user has `prefers-reduced-motion: reduce` set.
