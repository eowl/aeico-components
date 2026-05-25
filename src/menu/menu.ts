import AeicoComponent from '../aeico-component';
import type { InferProps } from 'aeico';
import { html, prop } from 'aeico';
import style from '../styles/components/menu.css?inline';
import variables from '../styles/variables.css?inline';
import type { MenuMode, MenuOrientation, MenuSelectDetail, MenuTrigger } from './defines';
// Ensure ae-menu-item is registered when this module is used
import './menu-item';

/**
 * Menu navigation component. Renders a horizontal or vertical menu with
 * optional two-level flyout or inline (accordion) submenus.
 *
 * Two modes:
 * - `flyout` (default) — submenus open as floating panels (like a nav bar or
 *   context menu).
 * - `inline` — submenus expand in-place (accordion-style sidebar).
 *
 * Emits:
 * - `select` — `{ detail: { key, label, keyPath } }` when a leaf item is clicked.
 */
class Menu extends AeicoComponent {
  static tagName = 'menu';

  protected static styles = [variables, style];

  @prop({ type: String })
  accessor mode: MenuMode = 'flyout';

  @prop({ type: String })
  accessor orientation: MenuOrientation = 'horizontal';

  @prop({ type: String })
  accessor trigger: MenuTrigger = 'click';

  @prop({ type: String })
  accessor selectedKey: string | undefined;

  connectedCallback() {
    super.connectedCallback();
    this.listen('_menu-item-select', this._handleItemSelect as EventListener);
  }

  private _handleItemSelect = (e: CustomEvent<MenuSelectDetail>): void => {
    const { key, label, keyPath } = e.detail;
    // Update visual selection on all leaf items
    this.querySelectorAll('ae-menu-item').forEach((el) => {
      const item = el;
      item.selected = item.key === key && !item.label; // only leaf items
    });
    this.selectedKey = key;
    this.emit('select', { detail: { key, label, keyPath } });
  };

  protected render() {
    const isHorizontal = this.orientation === 'horizontal';
    return html(({ div, slot }) => {
      div(
        {
          className: { 'menu-list': true, 'menu-list--horizontal': isHorizontal },
          role: isHorizontal ? 'menubar' : 'menu',
          'aria-orientation': this.orientation,
        },
        () => {
          slot();
        },
      );
    });
  }
}

Menu.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-menu': Menu;
  }
}

export default Menu;
export type MenuProps = InferProps<typeof Menu>;
