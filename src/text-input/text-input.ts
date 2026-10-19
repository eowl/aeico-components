import AeicoField from '../aeico-field';
import type { InferProps } from 'aeico';
import { html, prop } from 'aeico';
import type { InputType } from './defines';
import { getInternalName } from '../utils/icon';
import '../icon/icon';
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
  accessor type: InputType | undefined;

  @prop({ type: Boolean })
  accessor readonly: boolean | undefined;

  @prop({ type: Boolean })
  accessor visibleToggle: boolean | undefined;

  private _passwordVisible = false;
  private _hasInlineActions = false;
  private _inlineClearBtn: HTMLButtonElement | null = null;
  private _inlineResetBtn: HTMLButtonElement | null = null;

  protected static styles = [variables, sizeCSS, fieldLabelCSS, actionButtonCSS, style];

  render() {
    return html(({ div, input, slot, button, span, aeIcon }) => {
      const id = this.getFieldId();
      const inputType = (this.type || 'text') as InputType;
      this.renderLabel(id);

      div({ className: 'input-container field-body' }, () => {
        slot({ name: 'start', '@slotchange': () => this.onIconSlotChange() });
        this.fieldElement = input({
          id,
          type: inputType === 'password' && this._passwordVisible ? 'text' : inputType,
          placeholder: this.placeholder || '',
          required: Boolean(this.required),
          disabled: Boolean(this.disabled),
          readonly: Boolean(this.readonly),
          '@input': this.boundOnChange,
        });
        slot({ name: 'end', '@slotchange': () => this.onIconSlotChange() });

        let toggleBtn: HTMLButtonElement | null = null;
        if (this.visibleToggle && inputType === 'password') {
          toggleBtn = button(
            {
              className: 'toggle-btn',
              type: 'button',
              'aria-label': this._passwordVisible ? 'Hide password' : 'Show password',
              '@click': () => this.togglePasswordVisibility(),
            },
            () => {
              aeIcon({ name: getInternalName(this._passwordVisible ? 'not-visible' : 'visible') });
            },
          );
        }

        const inlineActions = !this.actionButtonStyle;
        let clearBtn: HTMLButtonElement | null = null;
        let resetBtn: HTMLButtonElement | null = null;
        const showClear = inlineActions && this.clearable && !!this.getValue();
        const showReset =
          inlineActions && this.resettable && this.getValue() !== (this.defaultValue || '');

        if (inlineActions && this.clearable) {
          clearBtn = button(
            {
              className: 'action-icon-btn',
              type: 'button',
              'aria-label': 'Clear',
              'data-action': 'clear',
              '@click': this.boundOnClear,
              style: { display: showClear ? '' : 'none' },
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
        if (inlineActions && this.resettable) {
          resetBtn = button(
            {
              className: 'action-icon-btn',
              type: 'button',
              'aria-label': 'Reset',
              'data-action': 'reset',
              '@click': this.boundOnReset,
              style: { display: showReset ? '' : 'none' },
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
        this._hasInlineActions = inlineActions && (!!clearBtn || !!resetBtn || !!toggleBtn);

        if (inlineActions) {
          this._inlineClearBtn = clearBtn;
          this._inlineResetBtn = resetBtn;
        } else {
          this._inlineClearBtn = null;
          this._inlineResetBtn = null;
          this.renderActionButtons();
        }
      });
      this.renderHelperText();
      this.renderError();
      this.onIconSlotChange();

      if (this.fieldElement && this.value != null) {
        this.fieldElement.value = String(this.value);
      }
    });
  }

  protected onUpdated(_changedProps: Map<string, unknown>): void {
    super.onUpdated?.(_changedProps);
    const value = this.getValue();
    if (this._inlineClearBtn) {
      this._inlineClearBtn.style.display = this.clearable && !!value ? '' : 'none';
    }
    if (this._inlineResetBtn) {
      this._inlineResetBtn.style.display =
        this.resettable && value !== (this.defaultValue || '') ? '' : 'none';
    }
  }

  private togglePasswordVisibility(): void {
    this._passwordVisible = !this._passwordVisible;
    this.update();

    if (this.fieldElement) {
      this.fieldElement.type = this._passwordVisible ? 'text' : 'password';
      this.fieldElement.focus();
    }
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
      (!!endSlot && endSlot.assignedElements().length > 0) || this._hasInlineActions,
    );
  }

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
