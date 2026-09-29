import type { InferProps } from 'aeico';
import styleVariables from '../styles/variables.css';
import sizeCSS from '../styles/size.css';
import colorCSS from '../styles/color.css';
import buttonStyle from '../styles/components/button.css';
import AeicoComponent from '../aeico-component';
import { html } from 'aeico';
import { ButtonColor, ButtonSize, ButtonVariant } from './defines';
import { prop } from 'aeico';

/**
 * Button Component
 *
 * A customizable button component with multiple variants and sizes.
 * Supports theme and internationalization through mixins.
 *
 * @example
 * ```typescript
 * // Using the static create method
 * const button = Button.create({
 *   variant: 'primary',
 *   size: 'md'
 * })
 * ```
 *
 * @example
 * ```html
 * <!-- Using as Web Component -->
 * <ae-button variant="primary" size="md">Save</ae-button>
 * <ae-button variant="danger" size="sm">Delete</ae-button>
 * <ae-button variant="subtle">Cancel</ae-button>
 * ```
 *
 * @example
 * ```html
 * <!-- Link button - renders as an anchor -->
 * <ae-button href="/settings" color="primary">Settings</ae-button>
 * <ae-button href="https://example.com" target="_blank" rel="noopener noreferrer">Docs</ae-button>
 * ```
 */
class Button extends AeicoComponent {
  protected static styles = [styleVariables, sizeCSS, colorCSS, buttonStyle];

  @prop({ type: String })
  color?: ButtonColor;

  @prop({ type: String })
  variant?: ButtonVariant;

  @prop({ type: String })
  size?: ButtonSize;

  @prop({ type: Boolean })
  disabled?: boolean;

  @prop({ type: String })
  type?: 'button' | 'submit' | 'reset';

  @prop({ type: Boolean })
  active?: boolean;

  @prop({ type: Boolean })
  block?: boolean;

  @prop({ type: String })
  href?: string;

  @prop({ type: String })
  target?: string;

  @prop({ type: String })
  rel?: string;

  private _controlElement: HTMLButtonElement | HTMLAnchorElement | null = null;
  private _slotElement: HTMLSlotElement | null = null;
  private _autoAriaLabel = false;

  protected onMounted() {
    this._handleSlotChange();
  }

  private _handleSlotChange = () => {
    const nodes = this._slotElement?.assignedNodes() ?? [];
    // Icon-only: exactly one element (ae-icon) and no meaningful text nodes
    const elements = nodes.filter((n): n is Element => n.nodeType === Node.ELEMENT_NODE);
    const hasText = nodes.some(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim() !== '',
    );
    const isIconOnly =
      !hasText && elements.length === 1 && elements[0].tagName.toLowerCase() === 'ae-icon';

    if (isIconOnly) {
      this.setAttribute('icon-only', '');
      if (!this.hasAttribute('aria-label') || this._autoAriaLabel) {
        this.setAttribute('aria-label', elements[0].getAttribute('name') ?? '');
        this._autoAriaLabel = true;
      }
    } else {
      this.removeAttribute('icon-only');
      if (this._autoAriaLabel) {
        this.removeAttribute('aria-label');
        this._autoAriaLabel = false;
      }
    }
  };

  protected render() {
    return html(({ button, a, slot }) => {
      const children = () => {
        this._slotElement = slot({ '@slotchange': this._handleSlotChange });
      };

      if (this.href) {
        this._controlElement = a(
          {
            href: this.disabled ? undefined : this.href,
            target: this.target,
            rel: this.rel,
            part: 'button',
            'aria-pressed': this.active,
            'aria-disabled': this.disabled ? 'true' : undefined,
          },
          children,
        );
      } else {
        this._controlElement = button(
          {
            type: this.type || 'button',
            disabled: this.disabled,
            part: 'button',
            'aria-pressed': this.active,
            'aria-disabled': this.disabled ? 'true' : undefined,
          },
          children,
        );
      }
    });
  }

  /**
   * Programmatically click the button
   */
  click() {
    if (!this.disabled && this._controlElement) {
      this._controlElement.click();
    }
  }

  /**
   * Focus the button
   */
  focus() {
    if (this._controlElement) {
      this._controlElement.focus();
    }
  }

  /**
   * Blur the button
   */
  blur() {
    if (this._controlElement) {
      this._controlElement.blur();
    }
  }
}

Button.define('button');

declare global {
  interface HTMLElementTagNameMap {
    'ae-button': Button;
  }
}

export default Button;
export type ButtonProps = InferProps<typeof Button>;
