# Tabs

`Navigation` `Layout`

Organises content into switchable panels. Pairs `<ae-tab>` (the clickable tab handle) with `<ae-tab-panel>` (the associated content). Tabs and panels are matched by position order, or by a shared `panel` / `id` pair.

Includes three components: `ae-tabs`, `ae-tab`, and `ae-tab-panel`.

## Import

```js
import 'aeico-components/tabs';

// Full bundle
import 'aeico-components';
```

## Examples

### Basic — positional matching

```html
<ae-tabs>
  <ae-tab>Overview</ae-tab>
  <ae-tab>Details</ae-tab>
  <ae-tab>Reviews</ae-tab>

  <ae-tab-panel>Overview content here.</ae-tab-panel>
  <ae-tab-panel>Detailed information here.</ae-tab-panel>
  <ae-tab-panel>Customer reviews here.</ae-tab-panel>
</ae-tabs>
```

### `activeIndex` — initially active tab

```html
<ae-tabs activeIndex="1">
  <ae-tab>First</ae-tab>
  <ae-tab>Second (active)</ae-tab>
  <ae-tab>Third</ae-tab>

  <ae-tab-panel>First panel.</ae-tab-panel>
  <ae-tab-panel>Second panel.</ae-tab-panel>
  <ae-tab-panel>Third panel.</ae-tab-panel>
</ae-tabs>
```

### ID-based matching via `panel` and `id`

```html
<ae-tabs>
  <ae-tab panel="profile">Profile</ae-tab>
  <ae-tab panel="settings">Settings</ae-tab>

  <ae-tab-panel id="settings">Settings content.</ae-tab-panel>
  <ae-tab-panel id="profile">Profile content.</ae-tab-panel>
</ae-tabs>
```

### `disabled` tab

```html
<ae-tabs>
  <ae-tab>Available</ae-tab>
  <ae-tab disabled>Unavailable</ae-tab>
  <ae-tab>Also Available</ae-tab>

  <ae-tab-panel>Panel 1</ae-tab-panel>
  <ae-tab-panel>Panel 2</ae-tab-panel>
  <ae-tab-panel>Panel 3</ae-tab-panel>
</ae-tabs>
```

### Custom border colour via CSS variable

```html
<ae-tabs style="--ae-tabs-border-color: #9333ea;">
  <ae-tab>Tab A</ae-tab>
  <ae-tab>Tab B</ae-tab>
  <ae-tab-panel>Panel A</ae-tab-panel>
  <ae-tab-panel>Panel B</ae-tab-panel>
</ae-tabs>
```

### Listening to `change`

```html
<ae-tabs id="t1">
  <ae-tab>Tab 1</ae-tab>
  <ae-tab>Tab 2</ae-tab>
  <ae-tab-panel>Panel 1</ae-tab-panel>
  <ae-tab-panel>Panel 2</ae-tab-panel>
</ae-tabs>

<script type="module">
  import 'aeico-components/tabs';
  document.querySelector('#t1').addEventListener('change', (e) => {
    console.log('Active index:', e.detail.index);
  });
</script>
```

---

## `ae-tabs` Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `activeIndex` | `number` | `0` | Zero-based index of the initially active tab. |

## `ae-tabs` Slots

| Name | Description |
|------|-------------|
| (default) | `<ae-tab>` and `<ae-tab-panel>` elements, interleaved or separate. |

## `ae-tabs` Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ index: number }` | Fired when the active tab changes. |

## `ae-tabs` CSS Custom Properties

| Property | Description |
|----------|-------------|
| `--ae-tabs-gap` | Gap between the tab bar and the panel content. |
| `--ae-tabs-border-color` | Colour of the border beneath the tab bar. |

## `ae-tabs` CSS Parts

| Part | Description |
|------|-------------|
| `tab-nav` | The tab button bar container. |
| `panels` | The panel content area. |

---

## `ae-tab` Properties

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `active` | `boolean` | `false` | Marks this tab as active (usually managed by `ae-tabs`). |
| `disabled` | `boolean` | `false` | Makes the tab non-clickable. |
| `panel` | `string` | — | The `id` of the associated `<ae-tab-panel>`. Uses positional matching when omitted. |

## `ae-tab` Slots

| Name | Description |
|------|-------------|
| (default) | Tab label content. |

## `ae-tab` CSS Parts

| Part | Description |
|------|-------------|
| `tab` | The root button element. |

---

## `ae-tab-panel` Slots

| Name | Description |
|------|-------------|
| (default) | Panel content. Shown only when the associated tab is active. |
