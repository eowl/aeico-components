import type { InferProps } from 'aeico';
import styleVariables from '../styles/variables.css';
import style from '../styles/components/breadcrumb-item.css';
import AeicoComponent from '../aeico-component';
import { html } from 'aeico';
import { prop } from 'aeico';

/**
 * BreadcrumbItem Component
 *
 * A single item in the `ae-breadcrumb` navigation trail.
 * Renders as a link (`<a>`) when `href` is provided, otherwise as plain text.
 * The separator is injected by the parent `ae-breadcrumb`.
 *
 * @example
 * ```html
 * <ae-breadcrumb>
 *   <ae-breadcrumb-item href="/">Home</ae-breadcrumb-item>
 *   <ae-breadcrumb-item href="/docs">Docs</ae-breadcrumb-item>
 *   <ae-breadcrumb-item>Current Page</ae-breadcrumb-item>
 * </ae-breadcrumb>
 * ```
 */
class BreadcrumbItem extends AeicoComponent {

  protected static styles = [styleVariables, style];

  @prop({ type: String })
  accessor href: string | undefined;

  protected render() {
    return html(({ li, span, slot, a }) => {
      li({ part: 'item', className: 'item' }, () => {
        span({ part: 'separator', className: 'sep', 'aria-hidden': 'true' }, () => {
          slot({ name: 'separator' });
        });
        span({ part: 'label', className: 'label' }, () => {
          if (this.href) {
            a({ href: this.href, part: 'link' }, () => {
              slot();
            });
          } else {
            slot();
          }
        });
      });
    });
  }
}

BreadcrumbItem.define('breadcrumb-item');

declare global {
  interface HTMLElementTagNameMap {
    'ae-breadcrumb-item': BreadcrumbItem;
  }
}

export default BreadcrumbItem;
export type BreadcrumbItemProps = InferProps<typeof BreadcrumbItem>;
