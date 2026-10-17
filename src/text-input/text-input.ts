import AeicoField from '../aeico-field';
import type { InferProps } from 'aeico';
import { html, prop } from 'aeico';
import variables from '../styles/variables.css';
import sizeCSS from '../styles/size.css';
import fieldLabelCSS from '../styles/components/field-label.css';
import actionButtonCSS from '../styles/components/action-button.css';
import style from '../styles/components/text-input.css';

class TextInput extends AeicoField {
  protected fieldElement: HTMLInputElement | null = null;

  @prop({ type: String })
  accessor placeholder: string | undefined;

  @prop({ type: String })
  accessor type: string | undefined;

  protected static styles = [variables, sizeCSS, fieldLabelCSS, actionButtonCSS, style];

  render() {
    return html(({ div, input, slot }) => {
      const id = this.getFieldId();
      this.renderLabel(id);
      div({ className: 'input-container field-body' }, () => {
        slot({ name: 'start', '@slotchange': () => this.onIconSlotChange() });
        this.fieldElement = input({
          id,
          type: this.type || 'text',
          placeholder: this.placeholder || '',
          required: Boolean(this.required),
          disabled: Boolean(this.disabled),
          '@input': this.boundOnChange,
        });
        slot({ name: 'end', '@slotchange': () => this.onIconSlotChange() });

        this.renderActionButtons();
      });
      this.renderHelperText();
      this.renderError();
      this.onIconSlotChange();

      if (this.fieldElement && this.value != null) {
        this.fieldElement.value = String(this.value);
      }
    });
  }

  protected onIconSlotChange(): void {
    const container = this.shadowRoot?.querySelector('.input-container');
    if (!container) return;
    
    const startSlot = this.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="start"]');
    const endSlot = this.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="end"]');
    container.classList.toggle(
      'has-start-icon',
      !!startSlot && startSlot.assignedElements().length > 0,
    );
    container.classList.toggle(
      'has-end-icon',
      !!endSlot && endSlot.assignedElements().length > 0,
    );
  }

  /**
   * Write value to the input element (DOM only)
   */
  protected writeValue(value: string): void {
    const strValue = String(value || '');

    if (this.fieldElement) {
      this.fieldElement.value = strValue;
    }
  }
}

TextInput.define('text-input');

declare global {
  interface HTMLElementTagNameMap {
    'ae-text-input': TextInput;
  }
}

export default TextInput;
export type TextInputProps = InferProps<typeof TextInput>;
