import AeicoComponent from '../aeico-component';
import type { InferProps } from 'aeico';
import { html } from 'aeico';
import { prop } from 'aeico';
import style from '../styles/components/dropdown.css';
import variables from '../styles/variables.css';
import type { DropdownPlacement } from './defines';
// Ensure ae-dropdown-item is registered when this module is used
import './dropdown-item';

/**
 * Dropdown component — renders a floating menu panel anchored to a trigger slot.
 *
 * The trigger is provided via `slot="trigger"` (typically an `<ae-button>`).
 * Menu items are provided as `<ae-dropdown-item>` default-slot children.
 *
 * Emits:
 * - `open`   — when the panel opens
 * - `close`  — when the panel closes
 * - `select` — `{ detail: { value, label } }` when a menu item is clicked
 *
 * @example
 * ```html
 * <ae-dropdown>
 *   <ae-button slot="trigger">Actions</ae-button>
 *   <ae-dropdown-item value="edit" icon="edit">Edit</ae-dropdown-item>
 *   <ae-dropdown-item value="delete" danger icon="trash">Delete</ae-dropdown-item>
 * </ae-dropdown>
 * ```
 *
 * @example
 * ```html
 * <!-- Inside ae-navbar -->
 * <ae-navbar>
 *   <a slot="brand" href="/">MyApp</a>
 *   <ae-dropdown slot="end">
 *     <ae-button slot="trigger" variant="outlined" size="sm">User</ae-button>
 *     <ae-dropdown-item href="/profile" icon="user">Profile</ae-dropdown-item>
 *     <ae-dropdown-item value="logout" danger>Sign out</ae-dropdown-item>
 *   </ae-dropdown>
 * </ae-navbar>
 * ```
 */
class Dropdown extends AeicoComponent {

  protected static styles = [variables, style];

  /**
   * Position of the panel relative to the trigger.
   * Defaults to `'bottom-start'` (left-aligned, below trigger).
   */
  @prop({ type: String })
  accessor placement: DropdownPlacement = 'bottom-start';

  /**
   * Whether the dropdown panel is visible. Reflects as the `open` attribute.
   * Can be used for controlled open/close state.
   */
  @prop({ type: Boolean })
  accessor open: boolean = false;

  /**
   * When `true` (default), clicking a menu item automatically closes the panel.
   */
  @prop({ type: Boolean })
  accessor closeOnSelect: boolean = true;

  /** Disables the trigger and prevents opening. */
  @prop({ type: Boolean })
  accessor disabled: boolean = false;

  /**
   * Optional label text. When set, `ae-dropdown` renders its own trigger button
   * in the shadow DOM (no `slot="trigger"` needed). Inherits `--ae-navbar-link-*`
   * CSS variables so it automatically matches navbar link styles.
   */
  @prop({ type: String })
  accessor label: string = '';

  private _outsideClickHandler: ((e: MouseEvent) => void) | null = null;

  connectedCallback() {
    super.connectedCallback();

    this.listen('_item-select', this._handleItemSelect as EventListener);
    this.listen('keydown', this._handleKeydown as EventListener);

    this._outsideClickHandler = (e: MouseEvent) => {
      if (!this.open) return;
      const path = e.composedPath();
      if (!path.includes(this)) {
        this._closePanel();
      }
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

  /** Opens the dropdown panel. */
  show(): void {
    if (this.disabled || this.open) return;
    this.open = true;
    this.emit('open');
  }

  /** Closes the dropdown panel. */
  hide(): void {
    if (!this.open) return;
    this.open = false;
    this.emit('close');
  }

  /** Toggles the dropdown panel open/closed. */
  toggle(): void {
    if (this.open) {
      this.hide();
    } else {
      this.show();
    }
  }

  private _closePanel(): void {
    if (this.open) this.hide();
  }

  // Called via declarative @click on the trigger-wrapper div inside the shadow DOM.
  // Events from slotted trigger content bubble through the shadow DOM slot path,
  // so this fires for trigger clicks only — not for panel item clicks.
  private _handleTriggerClick = (): void => {
    this.toggle();
  };

  private _handleItemSelect = (e: CustomEvent): void => {
    this.emit('select', { detail: e.detail });
    if (this.closeOnSelect) {
      this._closePanel();
    }
  };

  private _handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this.open) {
      e.stopPropagation();
      this._closePanel();
    }
  };

  protected render() {
    const placementClass = `placement-${this.placement}`;
    const hasLabel = !!this.label;
    const dir = this.placement.split('-')[0];
    return html(({ div, slot, button, span }) => {
      div(
        {
          className: 'trigger-wrapper',
          'aria-haspopup': 'menu',
          'aria-expanded': String(this.open),
          '@click': this.disabled ? undefined : this._handleTriggerClick,
        },
        () => {
          if (hasLabel) {
            button(
              {
                className: 'trigger-label',
                type: 'button',
                disabled: this.disabled || undefined,
              },
              () => {
                span({ text: this.label });
                span({
                  className: `ae-dropdown-arrow ae-dropdown-arrow--${dir}`,
                  'aria-hidden': 'true',
                });
              },
            );
          } else {
            slot({ name: 'trigger' });
          }
        },
      );
      div(
        {
          part: 'panel',
          className: { panel: true, open: this.open, [placementClass]: true },
          role: 'menu',
        },
        () => {
          slot();
        },
      );
    });
  }
}

Dropdown.define('dropdown');

declare global {
  interface HTMLElementTagNameMap {
    'ae-dropdown': Dropdown;
  }
}

export default Dropdown;
export type DropdownProps = InferProps<typeof Dropdown>;
