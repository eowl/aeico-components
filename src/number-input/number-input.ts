import AeicoField from '../aeico-field';
import type { InferProps, Props } from 'aeico';
import { html } from 'aeico';
import variables from '../styles/variables.css?inline';
import sizeCSS from '../styles/size.css?inline';
import fieldLabelCSS from '../styles/components/field-label.css?inline';
import style from '../styles/components/number-input.css?inline';

class NumberInput extends AeicoField<number> {
  protected fieldElement: HTMLInputElement | null = null;

  static tagName = 'number-input';

  static props: Props = {
    placeholder: { type: String },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    controls: { type: Boolean },
  };

  declare placeholder?: string;
  declare min?: number;
  declare max?: number;
  declare step?: number;
  declare controls?: boolean;

  protected static styles = [variables, sizeCSS, fieldLabelCSS, style];

  render() {
    return html(({ div, input, button }) => {
      const id = this.getFieldId();
      this.renderLabel(id);
      div({ className: 'input-container field-body' }, () => {
        this.fieldElement = input({
          id,
          type: 'number',
          placeholder: this.placeholder || '',
          required: Boolean(this.required),
          disabled: Boolean(this.disabled),
          min: this.min != null ? String(this.min) : undefined,
          max: this.max != null ? String(this.max) : undefined,
          step: this.step != null ? String(this.step) : undefined,
          '@input': this.boundOnChange,
        });

        if (this.controls) {
          div({ className: 'number-controls' }, () => {
            button({
              className: 'number-btn number-btn-increment',
              textContent: '+',
              disabled: Boolean(this.disabled),
              '@click': this.boundOnIncrement,
            });
            button({
              className: 'number-btn number-btn-decrement',
              textContent: '-',
              disabled: Boolean(this.disabled),
              '@click': this.boundOnDecrement,
            });
          });
        }

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

  protected readonly boundOnIncrement = () => {
    const current = this.getValue() || 0;
    const step = this.step ?? 1;
    let next = current + step;
    if (this.max != null && next > this.max) {
      next = this.max;
    }
    this.setValue(next, { silent: false, action: 'change' });
  };

  protected readonly boundOnDecrement = () => {
    const current = this.getValue() || 0;
    const step = this.step ?? 1;
    let next = current - step;
    if (this.min != null && next < this.min) {
      next = this.min;
    }
    this.setValue(next, { silent: false, action: 'change' });
  };

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
   * Get current value as number
   */
  protected getValue(): number {
    if (!this.fieldElement) return 0;
    const val = this.fieldElement.value;
    if (val === '') return 0;
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  }

  /**
   * Write value to the input element (DOM only)
   */
  protected writeValue(value: number): void {
    if (this.fieldElement) {
      this.fieldElement.value = value != null ? String(value) : '';
    }

    this.updateClearButtonVisibility();
  }

  /**
   * Get event payload for change events
   */
  protected getEventPayload(
    value: number,
    oldValue: number,
    action: import('../aeico-field').FieldAction,
  ): Record<string, unknown> {
    return { value, oldValue, action };
  }
}

NumberInput.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-number-input': NumberInput;
  }
}

export default NumberInput;
export type NumberInputProps = InferProps<typeof NumberInput>;
