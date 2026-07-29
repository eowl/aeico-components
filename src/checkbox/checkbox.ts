import AeicoField, { type FieldAction } from '../aeico-field';
import type { InferProps, Props } from 'aeico';
import { html } from 'aeico';
import styleVariables from '../styles/variables.css';
import sizeCSS from '../styles/size.css';
import colorCSS from '../styles/color.css';
import fieldLabelCSS from '../styles/components/field-label.css';
import actionButtonCSS from '../styles/components/action-button.css';
import styles from '../styles/components/checkbox.css';
import { CheckboxVariant } from './defines';

class Checkbox extends AeicoField<boolean> {
  protected fieldElement: HTMLInputElement | null = null;


  static props: Props = {
    checked: { type: Boolean },
    defaultChecked: { type: Boolean },
    variant: { type: String },
  };

  declare checked?: boolean;
  declare defaultChecked?: boolean;
  declare variant?: CheckboxVariant;

  protected static styles = [
    styleVariables,
    sizeCSS,
    colorCSS,
    fieldLabelCSS,
    actionButtonCSS,
    styles,
  ];

  protected getValue(): boolean {
    return this.fieldElement?.checked ?? false;
  }

  protected writeValue(checked: boolean): void {
    if (this.fieldElement) {
      this.fieldElement.checked = Boolean(checked);
    }
  }

  protected getEventPayload(checked: boolean, oldChecked: boolean, action: FieldAction) {
    return { checked, oldChecked, action };
  }

  protected setValue(checked: boolean, options?: { silent?: boolean; action?: FieldAction }): void {
    const oldChecked = this.getValue();
    this.checked = checked;
    this.writeValue(checked);
    if (options?.silent === false) {
      this.emit('change', {
        detail: this.getEventPayload(checked, oldChecked, options.action || 'change'),
      });
    }
  }

  public reset(checked?: boolean, options?: { silent?: boolean }): void {
    this.setValue(checked !== undefined ? checked : (this.defaultChecked ?? false), {
      ...options,
      action: 'reset',
    });
  }

  public clear(options?: { silent?: boolean }): void {
    this.setValue(false, { ...options, action: 'clear' });
  }

  render() {
    return html(({ div, input }) => {
      const id = this.getFieldId();
      this.renderLabel(id);
      div({ className: 'checkbox-container field-body', variant: this.variant }, () => {
        div({ className: 'checkbox-wrapper' }, () => {
          this.fieldElement = input({
            id,
            type: 'checkbox',
            className: 'field-input',
            checked: Boolean(this.checked),
            disabled: Boolean(this.disabled),
            required: Boolean(this.required),
            '@change': this.boundOnChange,
          });
        });
        this.renderActionButtons();
      });
      this.renderHelperText();
      this.renderError();
    });
  }
}

Checkbox.define('checkbox');

declare global {
  interface HTMLElementTagNameMap {
    'ae-checkbox': Checkbox;
  }
}

export default Checkbox;
export type CheckboxProps = InferProps<typeof Checkbox>;
