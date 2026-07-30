import AeicoComponent from '../aeico-component';
import type { InferProps } from 'aeico';
import { html } from 'aeico';
import style from '../styles/components/select-option.css';
import variables from '../styles/variables.css';
import { prop } from 'aeico';

class SelectOption extends AeicoComponent {
  @prop({ type: String })
  accessor value: string | undefined;

  @prop({ type: String })
  accessor label: string | undefined;

  @prop({ type: Boolean })
  accessor disabled: boolean = false;

  @prop({ type: Boolean })
  accessor selected: boolean | undefined = false;

  protected static styles = [variables, style];

  connectedCallback() {
    super.connectedCallback();
    this.listen('click', this._handleClick);
  }

  private _handleClick = (e: Event): void => {
    if (this.disabled) {
      e.stopPropagation();

      return;
    }

    const displayLabel = this.label || this.textContent?.trim() || '';
    this.emit('selectoption', { detail: { value: this.value ?? '', label: displayLabel } });
  };

  render() {
    return html(({ div, slot }) => {
      div({ className: 'option-item' }, () => {
        slot();
      });
    });
  }
}

SelectOption.define('select-option');

declare global {
  interface HTMLElementTagNameMap {
    'ae-select-option': SelectOption;
  }
}

export default SelectOption;
export type SelectOptionProps = InferProps<typeof SelectOption>;
