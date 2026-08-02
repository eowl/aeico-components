import type { InferProps } from 'aeico';
import styleVariables from '../styles/variables.css';
import buttonGroupStyle from '../styles/components/button-group.css';
import AeicoComponent from '../aeico-component';
import { html, prop } from 'aeico';
import type { ButtonColor, ButtonVariant, ButtonSize } from '../button';
import Button from '../button/button';
import DropdownButton from '../dropdown/dropdown-button';

/**
 * ButtonGroup Component
 *
 * Groups multiple `ae-button` elements, propagating shared `variant`, `color`,
 * `size`, and `disabled` props to each child. Supports a `compact` mode that
 * joins buttons into a seamless connected strip (like Bootstrap's button group)
 * and a `vertical` mode that stacks buttons from top to bottom.
 *
 * @example
 * ```html
 * <!-- Loose group (gap between buttons) -->
 * <ae-button-group variant="outlined" color="primary">
 *   <ae-button>One</ae-button>
 *   <ae-button>Two</ae-button>
 *   <ae-button>Three</ae-button>
 * </ae-button-group>
 *
 * <!-- Compact - joined strip -->
 * <ae-button-group compact color="primary">
 *   <ae-button>Left</ae-button>
 *   <ae-button>Middle</ae-button>
 *   <ae-button>Right</ae-button>
 * </ae-button-group>
 *
 * <!-- Vertical stack -->
 * <ae-button-group vertical color="primary">
 *   <ae-button>Top</ae-button>
 *   <ae-button>Middle</ae-button>
 *   <ae-button>Bottom</ae-button>
 * </ae-button-group>
 *
 * <!-- Full-width -->
 * <ae-button-group block color="danger" variant="outlined">
 *   <ae-button>Delete</ae-button>
 *   <ae-button>Archive</ae-button>
 * </ae-button-group>
 * ```
 */
class ButtonGroup extends AeicoComponent {
  @prop({ type: String })
  accessor variant: ButtonVariant = 'filled';

  @prop({ type: String })
  accessor color: ButtonColor = 'default';

  @prop({ type: String })
  accessor size: ButtonSize = 'md';

  @prop({ type: Boolean })
  accessor compact: boolean = false;

  @prop({ type: Boolean })
  accessor block: boolean = false;

  @prop({ type: Boolean })
  accessor disabled: boolean = false;

  @prop({ type: Boolean })
  accessor vertical: boolean = false;

  protected static styles = [styleVariables, buttonGroupStyle];

  private slotEl: HTMLSlotElement | null = null;

  connectedCallback() {
    super.connectedCallback();
  }

  protected render() {
    return html(({ slot }) => {
      this.slotEl = slot({
        '@slotchange': () => this._syncChildren(),
      });
      this._syncChildren();
    });
  }

  private _getButtons(): Array<Button | DropdownButton> {
    if (!this.slotEl) return [];

    return (
      this.slotEl.assignedElements({ flatten: true }) as Array<Button | DropdownButton>
    ).filter((el) => {
      const tag = el.tagName.toLowerCase();
      return tag === 'ae-button' || tag === 'ae-dropdown-button';
    });
  }

  private _syncChildren() {
    const buttons = this._getButtons();
    const isSmall = this.size === 'xs' || this.size === 'sm';
    const r = isSmall ? 'var(--ae-radius-xs)' : 'var(--ae-radius-sm)';

    buttons.forEach((btn: Button | DropdownButton, i) => {
      btn.variant = this.variant;
      btn.color = this.color;
      btn.size = this.size;

      if (this.disabled) {
        btn.disabled = true;
      } else {
        btn.disabled = false;
      }

      if (this.compact) {
        const isFirst = i === 0;
        const isLast = i === buttons.length - 1;

        if (this.vertical) {
          btn.style.marginTop = isFirst ? '' : '-1px';
          btn.style.marginLeft = '';
          btn.style.setProperty('--_btn-r-tl', isFirst ? r : '0');
          btn.style.setProperty('--_btn-r-tr', isFirst ? r : '0');
          btn.style.setProperty('--_btn-r-bl', isLast ? r : '0');
          btn.style.setProperty('--_btn-r-br', isLast ? r : '0');
        } else {
          btn.style.marginLeft = isFirst ? '' : '-1px';
          btn.style.marginTop = '';
          btn.style.setProperty('--_btn-r-tl', isFirst ? r : '0');
          btn.style.setProperty('--_btn-r-bl', isFirst ? r : '0');
          btn.style.setProperty('--_btn-r-tr', isLast ? r : '0');
          btn.style.setProperty('--_btn-r-br', isLast ? r : '0');
        }
      } else {
        btn.style.marginLeft = '';
        btn.style.marginTop = '';
        this._clearRadius(btn);
      }
    });
  }

  private _clearRadius(btn: HTMLElement) {
    btn.style.removeProperty('--_btn-r-tl');
    btn.style.removeProperty('--_btn-r-tr');
    btn.style.removeProperty('--_btn-r-br');
    btn.style.removeProperty('--_btn-r-bl');
  }
}

ButtonGroup.define('button-group');

declare global {
  interface HTMLElementTagNameMap {
    'ae-button-group': ButtonGroup;
  }
}

export default ButtonGroup;
export type ButtonGroupProps = InferProps<typeof ButtonGroup>;
