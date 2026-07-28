import type { Props } from 'aeico';
import tabStyle from '../styles/components/tab.css';
import AeicoComponent from '../aeico-component';
import { html } from 'aeico';

class Tab extends AeicoComponent {
  static props: Props = {
    active: { type: Boolean },
    disabled: { type: Boolean },
    panel: { type: String },
  };

  declare active?: boolean;
  declare disabled?: boolean;
  declare panel?: string;

  protected static styles = [tabStyle];

  connectedCallback() {
    this.setAttribute('slot', 'tab');
    super.connectedCallback();
  }

  private _handleClick = () => {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent('_tab-click', {
        bubbles: true,
        composed: true,
      }),
    );
  };

  protected render() {
    return html(({ button, slot }) => {
      button(
        {
          part: 'tab',
          type: 'button',
          role: 'tab',
          'aria-selected': this.active,
          'aria-disabled': this.disabled,
          disabled: this.disabled,
          '@click': this._handleClick,
        },
        () => {
          slot();
        },
      );
    });
  }
}

Tab.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-tab': Tab;
  }
}

export default Tab;
