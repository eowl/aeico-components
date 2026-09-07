# Image

`Display`

An image with an optional dark semi-transparent caption overlay. Clicking the image opens a fullscreen viewer that supports wheel / double-click zoom, drag panning, and grouped prev / next navigation via the `group` attribute.

## Import

```js
import 'aeico-components/image';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-image src="photo.jpg" alt="A mountain"></ae-image>
```

Sizing works like a native `<img>`, controlled from outside the component or via the `width` / `height` props:

- No explicit size -> the image renders at its intrinsic dimensions (actual pixel size).
- Only a width (or the component is width-constrained by its container) -> height keeps the natural aspect ratio.
- Both a width and a height -> the image is letter-boxed/cropped according to `fit`.

```html
<!-- external CSS / container controls the box -->
<ae-image src="photo.jpg" style="width: 320px; height: 200px;"></ae-image>

<!-- width / height attributes (pixels) -->
<ae-image src="photo.jpg" width="320"></ae-image>
<ae-image src="photo.jpg" width="320" height="200" fit="cover"></ae-image>
```

### Caption

Use the `caption` attribute, or provide the default slot. The caption renders as a dark semi-transparent overlay at the bottom of the image (and inside the viewer).

```html
<ae-image src="photo.jpg" caption="Sunset over the coast"></ae-image>
<ae-image src="photo.jpg">Forest trail after rain</ae-image>
```

### Zoomable

Clicking the image opens a fullscreen viewer. In the viewer:

- Scroll the wheel or double-click to zoom (1x to 4x).
- Drag to pan while zoomed.
- Click the backdrop or press `Escape` to close.

Set `zoomable="false"` to disable.

```html
<ae-image src="photo.jpg" zoomable="false"></ae-image>
```

### Fit

Controls how the image fills the element box when both width and height are set.

```html
<ae-image src="photo.jpg" style="width: 200px; height: 140px;"></ae-image>
<ae-image src="photo.jpg" fit="contain" style="width: 200px; height: 140px;"></ae-image>
<ae-image src="photo.jpg" fit="fill" style="width: 200px; height: 140px;"></ae-image>
<ae-image src="photo.jpg" fit="none" style="width: 200px; height: 140px;"></ae-image>
```

### Group

Images sharing the same `group` value are navigated together in one viewer. Open any image of the group, then switch with the arrow buttons or the left / right arrow keys. A counter shows the current position.

```html
<ae-image group="gallery" src="a.jpg" caption="Image 1"></ae-image>
<ae-image group="gallery" src="b.jpg" caption="Image 2"></ae-image>
<ae-image group="gallery" src="c.jpg" caption="Image 3"></ae-image>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `src` | `string` | `''` | Image URL. |
| `alt` | `string` | `''` | Alternative text for accessibility. |
| `width` | `number` | `undefined` | Explicit width in pixels. |
| `height` | `number` | `undefined` | Explicit height in pixels. |
| `caption` | `string` | `''` | Caption text shown in the bottom overlay. Falls back to the default slot. |
| `zoomable` | `boolean` | `true` | Click to open the fullscreen viewer. |
| `group` | `string` | `''` | Group name. Images with the same group can be switched in one viewer. |
| `fit` | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` | Object fit for the thumbnail. |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | Passed to the thumbnail `img`, same as the native `loading` attribute. Use `eager` for above-the-fold / LCP images. |
| `decoding` | `'async' \| 'sync' \| 'auto'` | `'async'` | Passed to the thumbnail `img`, same as the native `decoding` attribute. |

## Methods

| Name | Description |
|------|-------------|
| `open()` | Open the fullscreen viewer. |
| `close()` | Close the viewer. |
| `isOpen()` | Returns whether the viewer is currently open. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `open` | `{ target }` | Emitted when the viewer opens. |
| `close` | `{ target }` | Emitted when the viewer closes (after the exit animation). |

## Slots

| Name | Description |
|------|-------------|
| (default) | Caption content, used when `caption` is not set. |

## CSS Custom Properties

| Token | Default | Description |
|-------|---------|-------------|
| `--ae-image-viewer-z-index` | `1000` | Z-index of the fullscreen viewer. |

## CSS Parts

| Part | Description |
|------|-------------|
| `image` | The thumbnail figure. |
| `img` | The thumbnail `img` element. |
| `caption` | The thumbnail caption overlay. |
