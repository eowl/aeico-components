import AeicoField from '../aeico-field';
import type { InferProps, Props } from 'aeico';
import { html } from 'aeico';
import variables from '../styles/variables.css?inline';
import sizeCSS from '../styles/size.css?inline';
import fieldLabelCSS from '../styles/components/field-label.css?inline';
import style from '../styles/components/text-input.css?inline';

class TextInput extends AeicoField {
  protected fieldElement: HTMLInputElement | null = null;

  static tagName = 'text-input';

  static props: Props = {
    placeholder: { type: String },
    type: { type: String },
  };

  declare placeholder?: string;
  declare type?: string;

  protected static styles = [variables, sizeCSS, fieldLabelCSS, style];

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
      this.updateClearButtonVisibility();
    });
  }

  /**
   * Update clear button visibility based on input value
   */
  private updateClearButtonVisibility() {
    if (this.clearBtn && this.fieldElement) {
      const hasValue = this.fieldElement.value.length > 0;
      this.clearBtn.style.display = hasValue ? '' : 'none';
    }
  }

  /**
   * Write value to the input element (DOM only)
   */
  protected writeValue(value: string): void {
    const strValue = String(value || '');

    if (this.fieldElement) {
      this.fieldElement.value = strValue;
    }

    this.updateClearButtonVisibility();
  }
}

TextInput.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-text-input': TextInput;
  }
}

export default TextInput;
export type TextInputProps = InferProps<typeof TextInput>;
