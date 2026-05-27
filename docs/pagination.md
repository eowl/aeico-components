# Pagination

`Navigation` `Data`

Provides page navigation controls for large datasets. Calculates page count automatically from `total` and `pageSize`, or accepts an explicit `pageCount`.

## Import

```js
import 'aeico-components/pagination';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic

```html
<ae-pagination total="100" page-size="10" page="1"></ae-pagination>
```

### `page` — controlled current page

```html
<ae-pagination total="200" page-size="20" page="3"></ae-pagination>
```

### `pageSize`

```html
<ae-pagination total="500" page-size="25"></ae-pagination>
```

### `pageCount` — override calculated page count

```html
<ae-pagination page-count="12" page="1"></ae-pagination>
```

### `siblingCount` — pages shown around the current page

```html
<!-- 2 sibling pages on each side -->
<ae-pagination total="200" page-size="10" sibling-count="2"></ae-pagination>
```

### `size`

```html
<ae-pagination total="100" size="xs"></ae-pagination>
<ae-pagination total="100" size="sm"></ae-pagination>
<ae-pagination total="100" size="md"></ae-pagination>
<ae-pagination total="100" size="lg"></ae-pagination>
```

### `simple` — compact prev/next with page input only

```html
<ae-pagination total="100" simple></ae-pagination>
```

### `showFirstLast` — dedicated first/last buttons

```html
<ae-pagination total="300" show-first-last></ae-pagination>
```

### `variant`

```html
<ae-pagination total="100" variant="borderless"></ae-pagination>
<ae-pagination total="100" variant="link"></ae-pagination>
```

### `disabled`

```html
<ae-pagination total="100" disabled></ae-pagination>
```

### Listening to `change`

```html
<ae-pagination id="pager" total="200" page-size="10"></ae-pagination>

<script type="module">
  import 'aeico-components/pagination';
  document.querySelector('#pager').addEventListener('change', (e) => {
    console.log('Current page:', e.detail.page);
    // fetch page data...
  });
</script>
```

### Custom previous/next button content

```html
<ae-pagination total="100">
  <ae-icon slot="prev" name="chevron-left"></ae-icon>
  <ae-icon slot="next" name="chevron-right"></ae-icon>
</ae-pagination>
```

## Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | `number` | `1` | Current page number (1-indexed). |
| `pageSize` | `number` | `10` | Number of items per page. Used to compute `pageCount`. |
| `total` | `number` | — | Total number of items. Used with `pageSize` to compute page count. |
| `pageCount` | `number` | — | Explicit total page count. Overrides the `total` / `pageSize` calculation. |
| `siblingCount` | `number` | `1` | Number of page buttons shown on each side of the current page. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Controls button size. |
| `disabled` | `boolean` | `false` | Disables all controls. |
| `simple` | `boolean` | `false` | Shows only prev/next buttons and a page number input. |
| `showFirstLast` | `boolean` | `false` | Adds dedicated first-page and last-page buttons. |
| `variant` | `'borderless' \| 'link'` | — | Visual style of page number buttons. |

## Slots

| Name | Description |
|------|-------------|
| `prev` | Custom content for the "previous" button. |
| `next` | Custom content for the "next" button. |
| `first` | Custom content for the "first page" button (requires `showFirstLast`). |
| `last` | Custom content for the "last page" button (requires `showFirstLast`). |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ page: number }` | Fired when the user navigates to a different page. |

## CSS Parts

| Part | Description |
|------|-------------|
| `root` | The root container element. |
| `prev` | The "previous page" button. |
| `next` | The "next page" button. |
| `first` | The "first page" button. |
| `last` | The "last page" button. |
| `item` | Each individual page number button. |
| `ellipsis` | The `…` gap indicator. |
| `page-input` | The page number input (in `simple` mode). |
| `page-total` | The total-pages display (in `simple` mode). |
