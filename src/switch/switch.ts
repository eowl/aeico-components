import AeicoField, { type FieldAction } from '../aeico-field';
import type { InferProps, Props } from 'aeico';
import { html } from 'aeico';
import styleVariables from '../styles/variables.css?inline';
import sizeCSS from '../styles/size.css?inline';
import colorCSS from '../styles/color.css?inline';
import styles from '../styles/components/switch.css?inline';

class Switch extends AeicoField<boolean> {
  protected fieldElement: HTMLInputElement | null = null;

  static tagName = 'switch';

  static props: Props = {
    checked: { type: Boolean },
    defaultChecked: { type: Boolean },
  };

  declare checked?: boolean;
  declare defaultChecked?: boolean;

  protected static styles = [styleVariables, sizeCSS, colorCSS, styles];

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
    return html(({ div, input, span }) => {
      div({ className: 'switch-container' }, () => {
        div({ className: 'switch-wrapper' }, () => {
          this.fieldElement = input({
            type: 'checkbox',
            className: 'field-input',
            checked: Boolean(this.checked),
            disabled: Boolean(this.disabled),
            '@change': this.boundOnChange,
          });
          span({ className: 'toggle-slider' });
        });
        this.renderActionButtons();
      });
    });
  }
}

Switch.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-switch': Switch;
  }
}

export default Switch;
export type SwitchProps = InferProps<typeof Switch>;
