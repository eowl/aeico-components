import type { InferProps } from 'aeico';
import styleVariables from '../styles/variables.css?inline';
import colorCSS from '../styles/color.css?inline';
import detailStyle from '../styles/components/detail.css?inline';
import AeicoComponent from '../aeico-component';
import { html } from 'aeico';
import { prop } from 'aeico';
import type { DetailColor, DetailVariant, DetailIconPlacement } from './defines';

/**
 * Detail component that can be used to show/hide additional content.
 *
 * @example
 * ```html
 * <ae-detail summary="Click Me">
 *  <ae-icon name="plus" slot="expand"></ae-icon>
 *  <ae-icon name="minus" slot="collapse"></ae-icon>
 *  Detail.....
 * </ae-detail>
 */
class Detail extends AeicoComponent {
  static tagName = 'detail';

  protected static styles = [styleVariables, colorCSS, detailStyle];

  @prop({ type: String })
  accessor summary: string = '';

  @prop({ type: String })
  accessor variant: DetailVariant = 'filled';

  @prop({ type: String })
  accessor color: DetailColor = 'default';

  @prop({ type: Boolean })
  accessor disabled: boolean = false;

  @prop({ type: String })
  accessor iconPlacement: DetailIconPlacement = 'end';

  private _open: boolean = false;

  /** Opens the detail panel. */
  open(): void {
    if (this.disabled || this._open) return;
    this._open = true;
    this.toggleAttribute('open', true);
    this.update();
    this.emit('open');
  }

  /** Closes the detail panel. */
  close(): void {
    if (!this._open) return;
    this._open = false;
    this.toggleAttribute('open', false);
    this.update();
    this.emit('close');
  }

  /** Toggles the detail panel open/closed. */
  toggle(): void {
    if (this._open) {
      this.close();
    } else {
      this.open();
    }
  }

  /** Returns whether the detail panel is currently open. */
  isOpen(): boolean {
    return this._open;
  }

  private _handleSummaryClick = (): void => {
    this.toggle();
  };

  protected render() {
    return html(({ div, button, span, slot }) => {
      div({ className: 'detail', part: 'detail' }, () => {
        button(
          {
            className: 'summary',
            part: 'summary',
            type: 'button',
            'aria-expanded': String(this._open),
            disabled: this.disabled || undefined,
            '@click': this._handleSummaryClick,
          },
          () => {
            slot({ name: 'summary' }, () => {
              span({ className: 'label', textContent: this.summary });
            });
            slot({ name: 'expand' });
            slot({ name: 'collapse' });
          },
        );
        div({ className: 'content-outer' }, () => {
          div(
            {
              className: 'content',
              part: 'content',
              role: 'region',
            },
            () => {
              slot();
            },
          );
        });
      });
    });
  }
}

Detail.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-detail': Detail;
  }
}

export default Detail;
export type DetailProps = InferProps<typeof Detail>;
export type { DetailIconPlacement };
