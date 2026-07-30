import AeicoComponent from '../aeico-component';
import type { InferProps } from 'aeico';
import { html } from 'aeico';
import style from '../styles/components/dropdown-item.css';
import variables from '../styles/variables.css';
import { prop } from 'aeico';
// Ensure ae-icon is registered when icons are used
import '../icon/icon';

/**
 * Dropdown menu item - used as a direct child of `<ae-dropdown>`.
 *
 * Renders as a `<button>` by default, or as an `<a>` anchor when `href` is set.
 * Use `<ae-icon>` inside to add icons, and CSS `color` / `--dropdown-item-color`
 * to apply danger or custom colours.
 *
 * @example
 * ```html
 * <ae-dropdown-item value="edit"><ae-icon name="edit"></ae-icon>Edit</ae-dropdown-item>
 * <ae-dropdown-item value="delete" style="--dropdown-item-color:var(--color-danger)">Delete</ae-dropdown-item>
 * <ae-dropdown-item href="/profile">Profile</ae-dropdown-item>
 * ```
 */
class DropdownItem extends AeicoComponent {
  /** Value emitted in the `select` event detail on the parent dropdown. */
  @prop({ type: String })
  accessor value: string | undefined;

  /** Disables the item - it becomes non-interactive and visually dimmed. */
  @prop({ type: Boolean })
  accessor disabled: boolean = false;

  /**
   * When set, the item renders as an `<a>` anchor element instead of a
   * `<button>`. Useful for navigation items.
   */
  @prop({ type: String })
  accessor href: string | undefined;

  /**
   * When `type="checkbox"`, the item behaves as a toggle: each click flips
   * `checked` and includes the new state in the `select` event detail.
   */
  @prop({ type: String })
  accessor type: 'checkbox' | undefined;

  /**
   * Whether the item is checked. Only meaningful when `type="checkbox"`.
   * Reflects as the `checked` attribute.
   */
  @prop({ type: Boolean })
  accessor checked: boolean = false;

  /**
   * Marks the item as the currently active/selected option (e.g. current route,
   * current sort order). Purely visual - applies a highlighted background and
   * accent colour.
   */
  @prop({ type: Boolean })
  accessor active: boolean = false;

  protected static styles = [variables, style];

  connectedCallback() {
    super.connectedCallback();
    this.listen('click', this._handleClick);
    this.setAttribute('role', 'menuitem');
  }

  private _handleClick = (e: Event): void => {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();

      return;
    }
    if (this.type === 'checkbox') {
      this.checked = !this.checked;
    }
    const label = this.textContent?.trim() ?? '';
    this.dispatchEvent(
      new CustomEvent('_item-select', {
        bubbles: true,
        composed: true,
        detail: { value: this.value ?? '', label, checked: this.checked },
      }),
    );
  };

  protected render() {
    const isCheckbox = this.type === 'checkbox';
    const sharedProps = {
      part: 'item',
      className: 'item',
      'aria-checked': isCheckbox ? String(this.checked) : undefined,
    };
    return html(({ button, a, span, slot }) => {
      const children = () => {
        if (isCheckbox) span({ className: 'check-indicator', 'aria-hidden': 'true' });
        slot();
      };
      if (this.href) {
        a(
          {
            ...sharedProps,
            href: this.disabled ? undefined : this.href,
            'aria-disabled': this.disabled || undefined,
          },
          children,
        );
      } else {
        button(
          {
            ...sharedProps,
            type: 'button',
            disabled: this.disabled,
          },
          children,
        );
      }
    });
  }
}

DropdownItem.define('dropdown-item');

declare global {
  interface HTMLElementTagNameMap {
    'ae-dropdown-item': DropdownItem;
  }
}

export default DropdownItem;
export type DropdownItemProps = InferProps<typeof DropdownItem>;
