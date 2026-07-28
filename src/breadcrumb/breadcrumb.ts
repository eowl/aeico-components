import type { InferProps } from 'aeico';
import styleVariables from '../styles/variables.css';
import colorCSS from '../styles/color.css';
import style from '../styles/components/breadcrumb.css';
import AeicoComponent from '../aeico-component';
import { html } from 'aeico';
import { prop } from 'aeico';
import type BreadcrumbItem from './breadcrumb-item';

/**
 * Breadcrumb Component
 *
 * A navigation trail that shows the user's location in a hierarchy.
 * Automatically injects separators between items and marks the last item
 * as `aria-current="page"`.
 *
 * The separator is configurable via:
 * - `separator` attribute (text, default `/`) — simple and concise
 * - `slot="separator"` (any element, e.g. `ae-icon`) — takes priority over the attribute
 *
 * Supports `color` for theming item link colors. The separator intentionally
 * uses a fixed muted color and does NOT respond to the `color` prop.
 *
 * @example
 * ```html
 * <!-- Default separator "/" -->
 * <ae-breadcrumb>
 *   <ae-breadcrumb-item href="/">Home</ae-breadcrumb-item>
 *   <ae-breadcrumb-item href="/docs">Docs</ae-breadcrumb-item>
 *   <ae-breadcrumb-item>Getting Started</ae-breadcrumb-item>
 * </ae-breadcrumb>
 *
 * <!-- Custom text separator -->
 * <ae-breadcrumb separator=">">
 *   <ae-breadcrumb-item href="/">Home</ae-breadcrumb-item>
 *   <ae-breadcrumb-item>Current</ae-breadcrumb-item>
 * </ae-breadcrumb>
 *
 * <!-- Icon separator (slot takes priority over separator attribute) -->
 * <ae-breadcrumb>
 *   <ae-icon slot="separator" name="chevron-right" size="xs"></ae-icon>
 *   <ae-breadcrumb-item href="/">Home</ae-breadcrumb-item>
 *   <ae-breadcrumb-item>Current</ae-breadcrumb-item>
 * </ae-breadcrumb>
 * ```
 */
class Breadcrumb extends AeicoComponent {
  static tagName = 'breadcrumb';

  protected static styles = [styleVariables, colorCSS, style];

  /** Text separator shown between items. Ignored when `slot="separator"` is provided. */
  @prop({ type: String })
  accessor separator: string = '/';

  @prop({ type: String })
  accessor color: string | undefined;

  private _itemsSlot: HTMLSlotElement | null = null;
  private _sepSlot: HTMLSlotElement | null = null;

  protected render() {
    return html(({ nav, ol, slot }) => {
      nav({ 'aria-label': 'breadcrumb', part: 'nav' }, () => {
        ol({ part: 'list', className: 'list' }, () => {
          this._itemsSlot = slot({
            '@slotchange': () => this._syncSeparators(),
          });
        });
      });
      this._sepSlot = slot({
        name: 'separator',
        className: 'sep-template',
        '@slotchange': () => this._syncSeparators(),
      });
    });
  }

  protected onUpdated() {
    this._syncSeparators();
  }

  private _getItems(): BreadcrumbItem[] {
    return (this._itemsSlot?.assignedElements() ?? []) as BreadcrumbItem[];
  }

  private _getSepElement(): Element | null {
    return this._sepSlot?.assignedElements()[0] ?? null;
  }

  private _syncSeparators = () => {
    const items = this._getItems();
    const sepEl = this._getSepElement();

    items.forEach((item, i) => {
      // Remove previously injected separators to avoid duplicates
      item.querySelectorAll('[data-ae-sep]').forEach((n) => n.remove());

      const isLast = i === items.length - 1;

      // Mark the last item as the current page for accessibility
      if (isLast) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }

      // First item gets no separator
      if (i === 0) return;

      const wrapper = document.createElement('span');
      wrapper.setAttribute('slot', 'separator');
      wrapper.setAttribute('data-ae-sep', '');
      wrapper.setAttribute('aria-hidden', 'true');

      if (sepEl) {
        // Clone the slotted separator element (e.g. ae-icon)
        wrapper.appendChild(sepEl.cloneNode(true));
      } else {
        // Fall back to text separator
        wrapper.textContent = this.separator;
      }

      item.prepend(wrapper);
    });
  };
}

Breadcrumb.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-breadcrumb': Breadcrumb;
  }
}

export default Breadcrumb;
export type BreadcrumbProps = InferProps<typeof Breadcrumb>;
