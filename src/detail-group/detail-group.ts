import type { InferProps, Props } from 'aeico';
import styleVariables from '../styles/variables.css';
import detailGroupStyle from '../styles/components/detail-group.css';
import AeicoComponent from '../aeico-component';
import { html } from 'aeico';
import type Detail from '../detail/detail';
import type { DetailColor, DetailVariant } from '../detail/defines';

/**
 * DetailGroup component — wraps multiple `ae-detail` elements into an
 * accordion-style group. By default only one item can be open at a time;
 * set `multiple` to allow several items open simultaneously.
 *
 * @example
 * ```html
 * <ae-detail-group>
 *   <ae-detail summary="Section 1">Content 1</ae-detail>
 *   <ae-detail summary="Section 2">Content 2</ae-detail>
 *   <ae-detail summary="Section 3">Content 3</ae-detail>
 * </ae-detail-group>
 * ```
 */
class DetailGroup extends AeicoComponent {

  static props: Props = {
    multiple: { type: Boolean },
    variant: { type: String },
    color: { type: String },
  };

  protected static styles = [styleVariables, detailGroupStyle];

  declare multiple?: boolean;
  declare variant?: DetailVariant;
  declare color?: DetailColor;

  private slotEl: HTMLSlotElement | null = null;

  private readonly DETAIL_RADIUS = 6;

  connectedCallback() {
    super.connectedCallback();
    this.listen('open', this._handleOpen);
  }

  private _getDetails(): Detail[] {
    if (!this.slotEl) return [];
    return (this.slotEl.assignedElements({ flatten: true }) as Detail[]).filter(
      (el) => el.tagName.toLowerCase() === 'ae-detail',
    );
  }

  private _syncChildren(): void {
    const details = this._getDetails();
    const r = this.DETAIL_RADIUS;

    details.forEach((detail, i) => {
      const isFirst = i === 0;
      const isLast = i === details.length - 1;

      // Collapse borders between adjacent items
      detail.style.marginTop = isFirst ? '' : '-1px';

      // Adjust per-corner radius so only the outer edges of the group keep it
      detail.style.setProperty('--detail-r-tl', isFirst ? `${r}px` : '0');
      detail.style.setProperty('--detail-r-tr', isFirst ? `${r}px` : '0');
      detail.style.setProperty('--detail-r-br', isLast ? `${r}px` : '0');
      detail.style.setProperty('--detail-r-bl', isLast ? `${r}px` : '0');

      // Propagate variant / color only when explicitly set on the group
      if (this.variant !== undefined) detail.variant = this.variant;
      if (this.color !== undefined) detail.color = this.color;
    });
  }

  private _handleOpen = (event: Event): void => {
    if (this.multiple) return;
    const opened = event.target as Element;
    this._getDetails().forEach((detail) => {
      if (detail !== opened) detail.close();
    });
  };

  protected render() {
    return html(({ slot }) => {
      this.slotEl = slot({
        '@slotchange': () => this._syncChildren(),
      });
      this._syncChildren();
    });
  }
}

DetailGroup.define('detail-group');

declare global {
  interface HTMLElementTagNameMap {
    'ae-detail-group': DetailGroup;
  }
}

export default DetailGroup;
export type DetailGroupProps = InferProps<typeof DetailGroup>;
