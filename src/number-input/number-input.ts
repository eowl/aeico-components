import AeicoField from '../aeico-field';
import type { InferProps, Props } from 'aeico';
import { html } from 'aeico';
import { getInternalName } from '../utils/icon';
import '../icon/icon';
import variables from '../styles/variables.css';
import sizeCSS from '../styles/size.css';
import fieldLabelCSS from '../styles/components/field-label.css';
import actionButtonCSS from '../styles/components/action-button.css';
import style from '../styles/components/number-input.css';

class NumberInput extends AeicoField<number> {
  protected fieldElement: HTMLInputElement | null = null;

  private _hasInlineActions = false;
  private _inlineClearBtn: HTMLButtonElement | null = null;
  private _inlineResetBtn: HTMLButtonElement | null = null;

  static props: Props = {
    placeholder: { type: String },
    min: { type: Number },
    max: { type: Number },
    step: { type: Number },
    controls: { type: Boolean },
    actionButton: { type: Boolean },
  };

  declare placeholder?: string;
  declare min?: number;
  declare max?: number;
  declare step?: number;
  declare controls?: boolean;
  declare actionButton?: boolean;

  protected static styles = [variables, sizeCSS, fieldLabelCSS, actionButtonCSS, style];

  render() {
    const inlineActions = !this.actionButton;
    return html(({ div, input, button, span, slot, aeIcon }) => {
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

        if (this.controls && !inlineActions) {
          div({ className: 'number-controls' }, () => {
            button({
              className: 'number-btn number-btn-increment',
              type: 'button',
              'aria-label': 'Increment',
              disabled: Boolean(this.disabled),
              '@click': this.boundOnIncrement,
            }, () => {
              aeIcon({ name: getInternalName('add') });
            });
            button({
              className: 'number-btn number-btn-decrement',
              type: 'button',
              'aria-label': 'Decrement',
              disabled: Boolean(this.disabled),
              '@click': this.boundOnDecrement,
            }, () => {
              aeIcon({ name: getInternalName('remove') });
            });
          });
        }

        if (inlineActions) {
          if (this.controls) {
            button({
              className: 'number-btn number-btn-inline number-btn-increment',
              type: 'button',
              'aria-label': 'Increment',
              disabled: Boolean(this.disabled),
              '@click': this.boundOnIncrement,
            }, () => {
              aeIcon({ name: getInternalName('add') });
            });
            button({
              className: 'number-btn number-btn-inline number-btn-decrement',
              type: 'button',
              'aria-label': 'Decrement',
              disabled: Boolean(this.disabled),
              '@click': this.boundOnDecrement,
            }, () => {
              aeIcon({ name: getInternalName('remove') });
            });
          }
          if (this.clearable) {
            this._inlineClearBtn = button(
              {
                className: 'action-icon-btn',
                type: 'button',
                'aria-label': 'Clear',
                'data-action': 'clear',
                '@click': this.boundOnClear,
                style: { display: this._hasRawValue() ? '' : 'none' },
              },
              () => {
                slot({ name: 'clear' }, () => {
                  if (this.clearText) {
                    span({ textContent: this.clearText });
                  } else {
                    aeIcon({ name: getInternalName('clear') });
                  }
                });
              },
            );
          }
          if (this.resettable) {
            this._inlineResetBtn = button(
              {
                className: 'action-icon-btn',
                type: 'button',
                'aria-label': 'Reset',
                'data-action': 'reset',
                '@click': this.boundOnReset,
                style: { display: this._matchesDefault() ? 'none' : '' },
              },
              () => {
                slot({ name: 'reset' }, () => {
                  if (this.resetText) {
                    span({ textContent: this.resetText });
                  } else {
                    aeIcon({ name: getInternalName('reset') });
                  }
                });
              },
            );
          }
        }

        if (!inlineActions) {
          this.renderActionButtons();
        }

        this._hasInlineActions = inlineActions && (this.controls || !!this._inlineClearBtn || !!this._inlineResetBtn);
        this._syncInlineContainer();
      });
      this.renderHelperText();
      this.renderError();

      if (this.fieldElement && this.value != null) {
        this.fieldElement.value = String(this.value);
      }
    });
  }

  /** Toggle border/background between the bare input and the container (like text-input icons) */
  private _syncInlineContainer(): void {
    const container = this.shadowRoot?.querySelector('.input-container');
    container?.classList.toggle('has-end-icon', this._hasInlineActions);
  }

  protected onUpdated(changedProps: Map<string, unknown>): void {
    super.onUpdated(changedProps);
    if (this._inlineClearBtn) {
      this._inlineClearBtn.style.display = this.clearable && this._hasRawValue() ? '' : 'none';
    }
    if (this._inlineResetBtn) {
      this._inlineResetBtn.style.display =
        this.resettable && !this._matchesDefault() ? '' : 'none';
    }
  }

  private _hasRawValue(): boolean {
    return !!this.fieldElement && this.fieldElement.value !== '';
  }

  private _matchesDefault(): boolean {
    if (!this.fieldElement) return true;
    const current = this.fieldElement.value;
    const def = this.defaultValue;
    return current === (def != null ? String(def) : '');
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

NumberInput.define('number-input');

declare global {
  interface HTMLElementTagNameMap {
    'ae-number-input': NumberInput;
  }
}

export default NumberInput;
export type NumberInputProps = InferProps<typeof NumberInput>;
