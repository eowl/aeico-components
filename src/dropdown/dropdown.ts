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
 * Dropdown component - renders a floating menu panel anchored to a trigger slot.
 *
 * The trigger is provided via `slot="trigger"` (typically an `<ae-button>`).
 * Menu items are provided as `<ae-dropdown-item>` default-slot children.
 *
 * Emits:
 * - `open`   - when the panel opens
 * - `close`  - when the panel closes
 * - `select` - `{ detail: { value, label } }` when a menu item is clicked
 *
 * @example
 * ```html
 * <!-- Trigger via slot -->
 * <ae-dropdown>
 *   <ae-button slot="trigger">Actions</ae-button>
 *   <ae-dropdown-item value="edit">Edit</ae-dropdown-item>
 *   <ae-dropdown-item value="delete">Delete</ae-dropdown-item>
 * </ae-dropdown>
 *
 * <!-- label prop with built-in trigger -->
 * <ae-dropdown label="User" placement="bottom-end">
 *   <ae-dropdown-item value="profile">Profile</ae-dropdown-item>
 *   <ae-dropdown-item value="logout">Sign out</ae-dropdown-item>
 * </ae-dropdown>
 *
 * <!-- label prop with start / end slots -->
 * <ae-dropdown label="Settings" placement="bottom-start">
 *   <ae-icon slot="start" name="settings" size="sm"></ae-icon>
 *   <ae-icon slot="end" name="ellipsis" size="sm"></ae-icon>
 *   <ae-dropdown-item value="a">Item A</ae-dropdown-item>
 * </ae-dropdown>
 * ```
 *
 * @example
 * ```html
 * <!-- Inside ae-navbar -->
 * <ae-navbar>
 *   <a slot="brand" href="/">MyApp</a>
 *   <ae-dropdown slot="end" label="User" placement="bottom-end">
 *     <ae-dropdown-item href="/profile">Profile</ae-dropdown-item>
 *     <ae-dropdown-item value="logout">Sign out</ae-dropdown-item>
 *   </ae-dropdown>
 * </ae-navbar>
 * ```
 */
class Dropdown extends AeicoComponent {
  protected static styles = [variables, style];

  @prop({ type: String })
  accessor placement: DropdownPlacement = 'bottom-start';

  @prop({ type: Boolean })
  accessor open: boolean = false;

  @prop({ type: Boolean })
  accessor closeOnSelect: boolean = true;

  @prop({ type: Boolean })
  accessor disabled: boolean = false;

  @prop({ type: String })
  accessor label: string = '';

  private _flipVertical = false;
  private _positionCleanup: (() => void) | null = null;
  private readonly _supportsPopover =
    typeof HTMLElement !== 'undefined' && 'popover' in HTMLElement.prototype;

  connectedCallback() {
    super.connectedCallback();

    this.listen('_item-select', this._handleItemSelect as EventListener);
    this.listen('keydown', this._handleKeydown as EventListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopPositioning();
  }

  show(): void {
    if (this.disabled || this.open) return;
    this.open = true;
    this._onOpenChanged(true);
    this.emit('open');
  }

  hide(): void {
    if (!this.open) return;
    this.open = false;
    this._onOpenChanged(false);
    this.emit('close');
  }

  toggle(): void {
    if (this.open) {
      this.hide();
    } else {
      this.show();
    }
  }

  private _onOpenChanged(open: boolean): void {
    if (this._supportsPopover) {
      const panel = this._getPanel();
      if (open && panel && !panel.matches(':popover-open')) {
        panel.showPopover();
        this._startPositioning();
      } else if (!open && panel?.matches(':popover-open')) {
        panel.hidePopover();
        this._stopPositioning();
      }
    }
    this._positionPanel();
  }

  private readonly _handlePopoverToggle = (e: Event): void => {
    const open = (e as ToggleEvent).newState === 'open';
    if (open === this.open) return;
    this.open = open;
    if (open) {
      this._startPositioning();
    } else {
      this._stopPositioning();
      this.emit('close');
    }
    this._positionPanel();
  };

  private _getPanel(): HTMLElement | null {
    return this.shadowRoot?.querySelector<HTMLElement>('.panel') ?? null;
  }

  private _closePanel(): void {
    if (this.open) this.hide();
  }

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

  protected onUpdated(changedProps: Map<string, unknown>): void {
    super.onUpdated(changedProps);
    if (changedProps.has('open')) this._onOpenChanged(this.open);
  }

  private _positionPanel(): void {
    if (!this._supportsPopover || !this.open) return;
    const panel = this._getPanel();
    if (!panel) return;
    const trigger = panel.previousElementSibling as HTMLElement | null;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const margin = 4;
    const [dir, align] = this.placement.split('-');

    const prevDisplay = panel.style.display;
    const wasOpen = panel.classList.contains('open');
    if (!wasOpen) {
      panel.style.visibility = 'hidden';
      panel.style.display = 'block';
    }
    const w = panel.offsetWidth;
    const h = panel.offsetHeight;
    if (!wasOpen) {
      panel.style.display = prevDisplay;
      panel.style.visibility = '';
    }

    if (dir === 'bottom') {
      this._flipVertical =
        rect.bottom + margin + h > window.innerHeight &&
        rect.top > window.innerHeight - rect.bottom;
    } else if (dir === 'top') {
      this._flipVertical = !(
        rect.top - margin - h < 0 && window.innerHeight - rect.bottom > rect.top
      );
    } else {
      this._flipVertical = false;
    }
    panel.classList.toggle('flipped', this._flipVertical);

    const startX =
      align === 'end'
        ? rect.right - w
        : align === undefined
          ? rect.left + (rect.width - w) / 2
          : rect.left;
    const startY = rect.top + (rect.height - h) / 2;

    panel.style.width = `${w}px`;
    if (dir === 'bottom' || dir === 'top') {
      const below = (dir === 'bottom') !== this._flipVertical;
      panel.style.left = `${startX}px`;
      if (below) {
        panel.style.bottom = '';
        panel.style.top = `${rect.bottom + margin}px`;
      } else {
        panel.style.top = '';
        panel.style.bottom = `${window.innerHeight - rect.top + margin}px`;
      }
    } else {
      const toLeft = dir === 'left';
      if (toLeft) {
        panel.style.right = `${window.innerWidth - rect.left + margin}px`;
        panel.style.left = '';
      } else {
        panel.style.left = `${rect.right + margin}px`;
        panel.style.right = '';
      }
      if (align === 'start') {
        panel.style.top = `${rect.top}px`;
      } else if (align === 'end') {
        panel.style.top = `${rect.bottom - h}px`;
      } else {
        panel.style.top = `${startY}px`;
      }
      panel.style.bottom = '';
    }
  }

  private _startPositioning(): void {
    this._positionPanel();
    if (this._positionCleanup) return;
    const onMove = () => {
      const trigger = this._getPanel()?.previousElementSibling as HTMLElement | null;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      if (
        rect.bottom < 0 ||
        rect.top > window.innerHeight ||
        rect.right < 0 ||
        rect.left > window.innerWidth
      ) {
        this._closePanel();
        return;
      }
      this._positionPanel();
    };
    document.addEventListener('scroll', onMove, true);
    window.addEventListener('resize', onMove);
    this._positionCleanup = () => {
      document.removeEventListener('scroll', onMove, true);
      window.removeEventListener('resize', onMove);
    };
  }

  private _stopPositioning(): void {
    this._positionCleanup?.();
    this._positionCleanup = null;
  }

  protected render() {
    const placementClass = `placement-${this.placement}`;
    const hasLabel = !!this.label;
    const dir = this.placement.split('-')[0];
    const hasEndSlot = this.querySelector('[slot="end"]') !== null;
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
                slot({ name: 'start' });
                span({ text: this.label });
                if (hasEndSlot) {
                  slot({ name: 'end' });
                } else {
                  span({
                    className: `ae-dropdown-arrow ae-dropdown-arrow--${dir}`,
                    'aria-hidden': 'true',
                  });
                }
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
          ...(this._supportsPopover
            ? { popover: 'auto' as const, '@toggle': this._handlePopoverToggle }
            : {}),
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
