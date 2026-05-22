import AeicoComponent from '../aeico-component';
import type { InferProps } from 'aeico';
import { html, prop } from 'aeico';
import style from '../styles/components/menu-item.css?inline';
import variables from '../styles/variables.css?inline';
import type { MenuMode, MenuOrientation, MenuTrigger } from './defines';

/**
 * Menu item — used as a direct child of `<ae-menu>` or nested inside another
 * `<ae-menu-item>` to create a two-level submenu.
 *
 * - **Leaf item**: omit `label`; slot contains the item text.
 * - **Parent item**: set `label` to the trigger text; slot children are
 *   `<ae-menu-item>` elements that appear in the submenu panel/section.
 */
class MenuItem extends AeicoComponent {
  static tagName = 'menu-item';

  protected static styles = [variables, style];

  @prop({ type: String })
  accessor key: string | undefined;

  @prop({ type: String })
  accessor label: string | undefined;

  @prop({ type: Boolean })
  accessor disabled: boolean = false;

  @prop({ type: String })
  accessor href: string | undefined;

  @prop({ type: Boolean })
  accessor selected: boolean = false;

  @prop({ type: Boolean })
  accessor open: boolean = false;

  private _outsideClickHandler: ((e: MouseEvent) => void) | null = null;
  private _closeTimer: ReturnType<typeof setTimeout> | null = null;

  connectedCallback() {
    super.connectedCallback();

    // data-depth lets CSS apply depth-specific styles without JS
    const depth = this.parentElement?.closest('ae-menu-item') ? 1 : 0;
    this.dataset.depth = String(depth);

    // Hover listeners — check mode/trigger at runtime
    this.listen('mouseenter', this._handleMouseEnter);
    this.listen('mouseleave', this._handleMouseLeave);

    // Outside-click to close flyout panel
    this._outsideClickHandler = (e: MouseEvent) => {
      if (!this.open) return;
      if (!e.composedPath().includes(this)) this.open = false;
    };
    
    document.addEventListener('click', this._outsideClickHandler);

    // Close own submenu when a leaf inside it is selected (flyout)
    this.listen('_menu-item-select', this._handleChildSelect as EventListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._outsideClickHandler) {
      document.removeEventListener('click', this._outsideClickHandler);
      this._outsideClickHandler = null;
    }
    if (this._closeTimer !== null) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
  }

  private get _parentMenu(): AeicoComponent | null {
    return (this.closest('ae-menu') ?? null) as AeicoComponent | null;
  }

  private get _mode(): MenuMode {
    return ((this._parentMenu as any)?.mode as MenuMode) ?? 'flyout';
  }

  private get _orientation(): MenuOrientation {
    return ((this._parentMenu as any)?.orientation as MenuOrientation) ?? 'horizontal';
  }

  private get _trigger(): MenuTrigger {
    return ((this._parentMenu as any)?.trigger as MenuTrigger) ?? 'click';
  }

  private get _isParent(): boolean {
    return this.label != null && this.label !== '';
  }

  /** Compute flyout panel placement based on depth and parent orientation. */
  private get _panelPlacement(): 'bottom' | 'right' {
    const isNested = !!this.parentElement?.closest('ae-menu-item');
    if (!isNested && this._orientation === 'horizontal') return 'bottom';
    return 'right';
  }

  private _isHoverTrigger(): boolean {
    return this._isParent && this._mode === 'flyout' && this._trigger === 'hover';
  }

  private _handleMouseEnter = (): void => {
    if (!this._isHoverTrigger()) return;
    if (this._closeTimer !== null) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
    this.open = true;
  };

  private _handleMouseLeave = (): void => {
    if (!this._isHoverTrigger()) return;
    this._closeTimer = setTimeout(() => {
      this.open = false;
      this._closeTimer = null;
    }, 150);
  };

  private _handleParentClick = (): void => {
    if (this.disabled) return;
    const mode = this._mode;
    const trigger = this._trigger;
    // In hover mode, click should still toggle (accessibility)
    if (mode === 'flyout' && trigger === 'hover') {
      this.open = !this.open;
      return;
    }
    this.open = !this.open;
  };

  private _handleLeafClick = (e: Event): void => {
    if (this.disabled) {
      e.preventDefault();
      return;
    }
    const path = this._buildKeyPath();
    const label = this.textContent?.trim() ?? '';
    this.dispatchEvent(
      new CustomEvent('_menu-item-select', {
        bubbles: true,
        composed: true,
        detail: { key: this.key ?? '', label, keyPath: path },
      }),
    );
  };

  private _handleChildSelect = (): void => {
    // Close flyout panel after a child leaf is selected
    if (this._mode === 'flyout') {
      this.open = false;
    }
  };

  private _handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this.open) {
      e.stopPropagation();
      this.open = false;
    }
  };

  private _buildKeyPath(): string[] {
    const path: string[] = [];
    if (this.key) path.unshift(this.key);
    let el: Element | null = this.parentElement;
    while (el) {
      const tag = el.tagName.toLowerCase();
      if (tag === 'ae-menu-item') {
        const k = (el as MenuItem).key;
        if (k) path.unshift(k);
      } else if (tag === 'ae-menu') {
        break;
      }
      el = el.parentElement;
    }
    return path;
  }

  protected render() {
    const mode = this._mode;
    const panelPlacement = this._panelPlacement;
    const isParent = this._isParent;
    const isInline = mode === 'inline';
    // Arrow direction: inline always shows ► (rotates to ▼ on open)
    // flyout-bottom shows ▼; flyout-right shows ►
    const arrowDir = !isInline && panelPlacement === 'bottom' ? 'bottom' : 'right';
    // Leaf items inside a submenu panel (depth > 0) need different padding
    const isNested = !!this.parentElement?.closest('ae-menu-item');

    return html(({ div, button, a, span, slot }) => {
      if (isParent) {
        div({ className: 'item-wrapper' }, () => {
          button(
            {
              type: 'button',
              className: { item: true, 'item--parent': true, 'item--open': this.open },
              disabled: this.disabled,
              'aria-haspopup': 'menu',
              'aria-expanded': String(this.open),
              '@click': this._handleParentClick,
              '@keydown': this._handleKeydown as EventListener,
            },
            () => {
              span({ text: this.label });
              span({ className: `item-arrow item-arrow--${arrowDir}`, 'aria-hidden': 'true' });
            },
          );

          if (isInline) {
            div(
              {
                className: { 'submenu-inline': true, open: this.open },
                role: 'menu',
              },
              () => {
                slot();
              },
            );
          } else {
            div(
              {
                className: {
                  'submenu-panel': true,
                  [`placement-${panelPlacement}`]: true,
                  open: this.open,
                },
                role: 'menu',
              },
              () => {
                slot();
              },
            );
          }
        });
      } else {
        // Leaf item
        const sharedProps = {
          className: { item: true, 'item--leaf-in-panel': isNested },
          role: 'menuitem',
          '@click': this._handleLeafClick,
          '@keydown': this._handleKeydown as EventListener,
        };

        if (this.href) {
          a(
            {
              ...sharedProps,
              href: this.disabled ? undefined : this.href,
              'aria-disabled': this.disabled ? 'true' : undefined,
            },
            () => {
              slot();
            },
          );
        } else {
          button(
            {
              ...sharedProps,
              type: 'button',
              disabled: this.disabled,
            },
            () => {
              slot();
            },
          );
        }
      }
    });
  }
}

MenuItem.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-menu-item': MenuItem;
  }
}

export default MenuItem;
export type MenuItemProps = InferProps<typeof MenuItem>;
