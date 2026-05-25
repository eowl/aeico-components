import type { InferProps } from 'aeico';
import styleVariables from '../styles/variables.css?inline';
import tooltipStyle from '../styles/components/tooltip.css?inline';
import AeicoComponent from '../aeico-component';
import { html, prop } from 'aeico';
import type { TooltipPlacement, TooltipTrigger } from './defines';

/**
 * Tooltip Component
 *
 * A floating label that appears on hover or focus around its trigger content.
 * Wrap any element in `<ae-tooltip>` and provide content via the `content`
 * attribute (plain text) or the `tooltip` named slot (rich HTML).
 *
 * @example
 * ```html
 * <ae-tooltip content="Save file">
 *   <ae-button>Save</ae-button>
 * </ae-tooltip>
 *
 * <ae-tooltip placement="bottom-start">
 *   <span slot="tooltip"><strong>Bold</strong> tip</span>
 *   <ae-icon-button name="info"></ae-icon-button>
 * </ae-tooltip>
 * ```
 */
class Tooltip extends AeicoComponent {
  protected static styles = [styleVariables, tooltipStyle];

  @prop({ type: String })
  accessor content: string | undefined;

  @prop({ type: String })
  accessor placement: TooltipPlacement = 'top';

  @prop({ type: Boolean })
  accessor disabled: boolean = false;

  @prop({ type: String })
  accessor trigger: TooltipTrigger = 'hover';

  @prop({ type: Boolean })
  accessor open: boolean = false;

  private _outsideClickHandler: ((e: MouseEvent) => void) | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.listen('mouseenter', this._handleMouseEnter);
    this.listen('mouseleave', this._handleMouseLeave);
    this.listen('focusin', this._handleFocusin);
    this.listen('focusout', this._handleFocusout);
    this.listen('click', this._handleClick);

    this._outsideClickHandler = (e: MouseEvent) => {
      if (!this.open) return;
      if (!e.composedPath().includes(this)) this.open = false;
    };
    document.addEventListener('click', this._outsideClickHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._outsideClickHandler) {
      document.removeEventListener('click', this._outsideClickHandler);
      this._outsideClickHandler = null;
    }
  }

  private _handleMouseEnter = () => {
    if (this.trigger !== 'hover') return;
    if (this.disabled) return;
    this.open = true;
  };

  private _handleMouseLeave = () => {
    if (this.trigger !== 'hover') return;
    this.open = false;
  };

  private _handleFocusin = () => {
    if (this.trigger !== 'hover') return;
    if (this.disabled) return;
    this.open = true;
  };

  private _handleFocusout = () => {
    if (this.trigger !== 'hover') return;
    this.open = false;
  };

  private _handleClick = () => {
    if (this.trigger !== 'click') return;
    if (this.disabled) return;
    this.open = !this.open;
  };

  protected render() {
    return html(({ div, span, slot }) => {
      slot();
      div(
        {
          className: `tooltip-panel placement-${this.placement ?? 'top'}`,
          role: 'tooltip',
          'aria-hidden': String(!this.open),
        },
        () => {
          slot({ name: 'tooltip' }, () => {
            span({ textContent: this.content ?? '' });
          });
        },
      );
    });
  }
}

Tooltip.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-tooltip': Tooltip;
  }
}

export type TooltipProps = InferProps<typeof Tooltip>;
export default Tooltip;
