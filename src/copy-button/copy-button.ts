import type { InferProps } from 'aeico';
import styleVariables from '../styles/variables.css?inline';
import sizeCSS from '../styles/size.css?inline';
import colorCSS from '../styles/color.css?inline';
import copyButtonStyle from '../styles/components/copy-button.css?inline';
import AeicoComponent from '../aeico-component';
import { html } from 'aeico';
import { prop } from 'aeico';
// Ensure ae-icon and ae-tooltip are registered
import '../icon/icon';
import '../tooltip/tooltip';
import type Tooltip from '../tooltip/tooltip';
import type { TooltipPlacement } from '../tooltip/defines';
import type { CopyButtonColor, CopyButtonSize, CopyButtonVariant } from './defines';

class CopyButton extends AeicoComponent {
  protected static styles = [styleVariables, sizeCSS, colorCSS, copyButtonStyle];

  @prop({ type: String })
  accessor text: string | undefined;

  @prop({ type: String })
  accessor color: CopyButtonColor | undefined;

  @prop({ type: String })
  accessor variant: CopyButtonVariant | undefined;

  @prop({ type: String })
  accessor size: CopyButtonSize | undefined;

  @prop({ type: Boolean })
  accessor disabled: boolean | undefined;

  @prop({ type: Number })
  accessor duration: number | undefined;

  @prop({ type: String })
  accessor tooltip: string = 'Copy';

  @prop({ type: String })
  accessor tooltipCopied: string = 'Copied!';

  @prop({ type: String })
  accessor tooltipPlacement: TooltipPlacement = 'top';

  private _slotElement: HTMLSlotElement | null = null;
  private _tooltipEl: Tooltip | null = null;
  private _resetTimer: ReturnType<typeof setTimeout> | null = null;

  private _getTextToCopy(): string {
    if (this.text != null) return this.text;

    const nodes = this._slotElement?.assignedNodes({ flatten: true }) ?? [];

    return nodes
      .reduce<string>((text, n) => {
        if (n.nodeType === Node.TEXT_NODE) return text + (n.textContent ?? '');

        return text;
      }, '')
      .trim();
  }

  private _handleClick = () => {
    if (this.disabled) return;

    const textToCopy = this._getTextToCopy();

    void navigator.clipboard.writeText(textToCopy).then(() => {
      this.setAttribute('copied', '');

      if (this._tooltipEl) {
        this._tooltipEl.content = this.tooltipCopied;
        this._tooltipEl.open = true;
      }

      if (this._resetTimer !== null) {
        clearTimeout(this._resetTimer);
      }
      const duration = this.duration ?? 2000;
      this._resetTimer = setTimeout(() => {
        this.removeAttribute('copied');
        if (this._tooltipEl) {
          this._tooltipEl.content = this.tooltip;
          this._tooltipEl.open = false;
        }
        this._resetTimer = null;
      }, duration);

      this.dispatchEvent(
        new CustomEvent('copy', {
          bubbles: true,
          composed: true,
          detail: { text: textToCopy },
        }),
      );
    });
  };

  protected onUnmounted() {
    if (this._resetTimer !== null) {
      clearTimeout(this._resetTimer);
      this._resetTimer = null;
    }
  }

  protected render() {
    return html(({ aeTooltip, button, span, slot, aeIcon }) => {
      this._tooltipEl = aeTooltip(
        {
          content: this.tooltip,
          placement: this.tooltipPlacement,
          disabled: this.disabled,
        },
        () => {
          button(
            {
              type: 'button',
              disabled: this.disabled,
              part: 'button',
              'aria-label': this.tooltip,
              'aria-disabled': this.disabled,
              '@click': this._handleClick,
            },
            () => {
              span({ className: 'icon-copy' }, () => {
                aeIcon({ name: 'copy' });
              });
              span({ className: 'icon-check' }, () => {
                aeIcon({ name: 'check' });
              });
              this._slotElement = slot();
            },
          );
        },
      );
    });
  }
}

CopyButton.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-copy-button': CopyButton;
  }
}

export default CopyButton;
export type CopyButtonProps = InferProps<typeof CopyButton>;
