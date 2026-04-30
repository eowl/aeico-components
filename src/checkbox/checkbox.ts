import AeicoField from '../aeico-field';
import type { InferProps, Props } from 'aeico';
import { html } from 'aeico';
import styleVariables from '../styles/variables.css?inline';
import sizeCSS from '../styles/size.css?inline';
import colorCSS from '../styles/color.css?inline';
import styles from '../styles/components/checkbox.css?inline';
import { CheckboxVariant } from './defines';

class Checkbox extends AeicoField {
  protected fieldElement: HTMLInputElement | null = null;

  static tagName = 'checkbox';

  static props: Props = {
    checked: { type: Boolean },
    defaultChecked: { type: Boolean },
    variant: { type: String },
  };

  declare checked?: boolean;
  declare defaultChecked?: boolean;
  declare variant?: CheckboxVariant;

  protected static styles = [styleVariables, sizeCSS, colorCSS, styles];

  protected getValue(): boolean {
    return this.fieldElement?.checked ?? false;
  }

  protected writeValue(checked: boolean): void {
    if (this.fieldElement) {
      this.fieldElement.checked = Boolean(checked);
    }
  }

  protected getEventPayload(checked: boolean, oldChecked: boolean, action: any) {
    return { checked, oldChecked, action };
  }

  protected setValue(checked: boolean, options?: { silent?: boolean; action?: any }): void {
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
      div({ className: 'checkbox-container', variant: this.variant }, () => {
        div({ className: 'checkbox-wrapper' }, () => {
          this.fieldElement = input({
            type: 'checkbox',
            className: 'field-input',
            checked: Boolean(this.checked),
            disabled: Boolean(this.disabled),
            '@change': this.boundOnChange,
          });
        });
        this.renderActionButtons();
      });
    });
  }
}

Checkbox.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-checkbox': Checkbox;
  }
}

export default Checkbox;
export type CheckboxProps = InferProps<typeof Checkbox>;
