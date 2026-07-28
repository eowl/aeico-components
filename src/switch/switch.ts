import AeicoField, { type FieldAction } from '../aeico-field';
import type { InferProps } from 'aeico';
import { html, prop } from 'aeico';
import type { SwitchIconPlacement } from './defines';
import '../icon/icon';
import styleVariables from '../styles/variables.css';
import sizeCSS from '../styles/size.css';
import colorCSS from '../styles/color.css';
import fieldLabelCSS from '../styles/components/field-label.css';
import actionButtonCSS from '../styles/components/action-button.css';
import styles from '../styles/components/switch.css';

class Switch extends AeicoField<boolean> {
  protected fieldElement: HTMLInputElement | null = null;

  static tagName = 'switch';

  @prop({ type: Boolean })
  accessor checked: boolean | undefined;

  @prop({ type: Boolean })
  accessor defaultChecked: boolean | undefined;

  @prop({ type: String })
  accessor icon: string | undefined;

  @prop({ type: String })
  accessor iconChecked: string | undefined;

  @prop({ type: String })
  accessor iconPlacement: SwitchIconPlacement | undefined;

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
    return html(({ div, input, span, aeIcon }) => {
      const id = this.getFieldId();
      this.renderLabel(id);
      div({ className: 'switch-container field-body' }, () => {
        div({ className: 'switch-wrapper' }, () => {
          this.fieldElement = input({
            id,
            type: 'checkbox',
            className: 'field-input',
            checked: Boolean(this.checked),
            disabled: Boolean(this.disabled),
            required: Boolean(this.required),
            '@change': this.boundOnChange,
          });
          const hasIcon = this.icon || this.iconChecked;
          const placement = this.iconPlacement ?? 'knob';
          span({ className: 'toggle-slider' }, () => {
            if (!hasIcon) return;
            if (placement === 'track') {
              span({ className: 'track-icon track-icon-left' }, () => {
                aeIcon({ name: this.iconChecked ?? this.icon! });
              });
              span({ className: 'track-icon track-icon-right' }, () => {
                aeIcon({ name: this.icon ?? this.iconChecked! });
              });
            } else {
              if (this.icon && this.iconChecked) {
                span({ className: 'toggle-knob-icon icon-unchecked' }, () => {
                  aeIcon({ name: this.icon! });
                });
                span({ className: 'toggle-knob-icon icon-checked' }, () => {
                  aeIcon({ name: this.iconChecked! });
                });
              } else {
                span({ className: 'toggle-knob-icon' }, () => {
                  aeIcon({ name: (this.icon ?? this.iconChecked)! });
                });
              }
            }
          });
        });
        this.renderActionButtons();
      });
      this.renderHelperText();
      this.renderError();
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
