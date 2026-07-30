import AeicoField from '../aeico-field';
import type { InferProps, Props } from 'aeico';
import { html } from 'aeico';
import variables from '../styles/variables.css';
import sizeCSS from '../styles/size.css';
import fieldLabelCSS from '../styles/components/field-label.css';
import actionButtonCSS from '../styles/components/action-button.css';
import style from '../styles/components/text-input.css';

class TextInput extends AeicoField {
  protected fieldElement: HTMLInputElement | null = null;

  static props: Props = {
    placeholder: { type: String },
    type: { type: String },
  };

  declare placeholder?: string;
  declare type?: string;

  protected static styles = [variables, sizeCSS, fieldLabelCSS, actionButtonCSS, style];

  render() {
    return html(({ div, input }) => {
      const id = this.getFieldId();
      this.renderLabel(id);
      div({ className: 'input-container field-body' }, () => {
        this.fieldElement = input({
          id,
          type: this.type || 'text',
          placeholder: this.placeholder || '',
          required: Boolean(this.required),
          '@input': this.boundOnChange,
        });

        this.renderActionButtons();
      });
      this.renderHelperText();
      this.renderError();

      if (this.fieldElement && this.value != null) {
        this.fieldElement.value = String(this.value);
      }
    });
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
