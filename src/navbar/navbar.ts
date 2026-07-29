import type { InferProps } from 'aeico';
import styleVariables from '../styles/variables.css';
import colorCSS from '../styles/color.css';
import navbarStyle from '../styles/components/navbar.css';
import AeicoComponent from '../aeico-component';
import { html } from 'aeico';
import { prop } from 'aeico';
import type { NavbarColor, NavbarAppearance } from './defines';

/**
 * Navbar Component
 *
 * A sticky top navigation bar with three slot regions and built-in
 * mobile hamburger collapse.
 *
 * Slots:
 * - `brand`  — leftmost area, typically a logo or site name link
 * - `start`  — main navigation links / dropdowns
 * - `end`    — right-side actions (login button, avatar, etc.)
 *
 * Slotted `<a>` elements receive default link styling controlled via
 * CSS custom properties. Mark the active link with `aria-current="page"`.
 *
 * @example
 * ```html
 * <ae-navbar color="primary" appearance="block">
 *   <a slot="brand" href="/">MyApp</a>
 *   <a slot="start" href="/" aria-current="page">Home</a>
 *   <a slot="start" href="/docs">Docs</a>
 *   <ae-button slot="end" size="sm" variant="outlined">Sign in</ae-button>
 * </ae-navbar>
 * ```
 *
 * @example
 * ```css
 * /* Custom height and transparent background *\/
 * ae-navbar {
 *   --ae-navbar-height: 4rem;
 *   --ae-navbar-bg: transparent;
 *   --ae-navbar-border-width: 0;
 *   --ae-navbar-shadow: 0 1px 8px rgba(0, 0, 0, 0.08);
 * }
 * ```
 */
class Navbar extends AeicoComponent {

  protected static styles = [styleVariables, colorCSS, navbarStyle];

  /** Background color using the design-system color token set. */
  @prop({ type: String })
  accessor color: NavbarColor | undefined;

  /** When true (default), the navbar sticks to the top of the viewport while scrolling. Set to false to let it scroll with the page. */
  @prop({ type: Boolean })
  accessor sticky: boolean = false;

  /**
   * Hover style preset for slotted `<a>` links.
   * - `text`  — only the font color changes on hover (default)
   * - `block` — a subtle filled background block appears on hover
   *
   * Fine-tune further with `--ae-navbar-link-hover-color` /
   * `--ae-navbar-link-hover-bg` CSS variables.
   */
  @prop({ type: String })
  accessor appearance: NavbarAppearance = 'text';

  /** Whether the mobile menu is expanded. Reflects as the `open` attribute. */
  @prop({ type: Boolean })
  accessor open: boolean = false;

  private _outsideClickHandler: ((e: MouseEvent) => void) | null = null;

  connectedCallback() {
    super.connectedCallback();
    // Close menu when clicking outside the navbar
    this._outsideClickHandler = (e: MouseEvent) => {
      // Event retargeting in shadow DOM means e.target is the host element
      // when the click originates inside the shadow root, so this check is safe.
      if (!this.contains(e.target as Node) && !this.shadowRoot?.contains(e.target as Node)) {
        this._closeMenu();
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

  /** Toggle the mobile menu open/closed. */
  toggleMenu(): void {
    this.open = !this.open;
  }

  private _handleInnerClick = (e: Event) => {
    if (!this.open) return;
    // Close mobile menu when a slotted <a> link is clicked
    const path = e.composedPath() as Element[];
    if (path.some((el) => (el as HTMLElement).tagName === 'A')) {
      this._closeMenu();
    }
  };

  private _toggleMenu = () => {
    this.open = !this.open;
  };

  private _closeMenu = () => {
    if (this.open) this.open = false;
  };

  protected render() {
    return html(({ div, nav, button, span, slot }) => {
      div({ class: 'inner', '@click': this._handleInnerClick }, () => {
        div({ part: 'brand' }, () => {
          slot({ name: 'brand' });
        });
        nav({ part: 'nav', 'aria-label': 'Main navigation' }, () => {
          div({ part: 'start' }, () => {
            slot({ name: 'start' });
          });
          div({ part: 'end' }, () => {
            slot({ name: 'end' });
          });
        });
        button(
          {
            part: 'hamburger',
            type: 'button',
            'aria-expanded': String(this.open),
            'aria-label': 'Toggle navigation',
            '@click': this._toggleMenu,
          },
          () => {
            span({ 'aria-hidden': 'true' });
            span({ 'aria-hidden': 'true' });
            span({ 'aria-hidden': 'true' });
          },
        );
      });
    });
  }
}

Navbar.define('navbar');

declare global {
  interface HTMLElementTagNameMap {
    'ae-navbar': Navbar;
  }
}

export default Navbar;
export type NavbarProps = InferProps<typeof Navbar>;
