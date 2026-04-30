import type { InferProps, Props, Watchers } from 'aeico';
import { tags } from 'aeico';
import AeicoComponent from './aeico-component';
import { t } from 'aeico-localize';

export type FieldAction = 'clear' | 'reset' | 'change';
export type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/**
 * Base class for form field components
 *
 * Provides common functionality for field components including:
 * - Theme support
 * - i18n integration (via Localizable mixin)
 * - Reset button management
 * - Value management
 * - Common configuration handling
 */
class AeicoField<TValue = string> extends AeicoComponent {
  /**
   * Define base field properties (extends AeicoElement properties)
   */
  static props: Props = {
    value: { type: String },
    defaultValue: { type: String },
    resettable: { type: Boolean },
    resetText: { type: String },
    clearable: { type: Boolean },
    clearText: { type: String },
    size: { type: String },
    disabled: { type: Boolean },
  };

  /**
   * Property watchers
   */
  static watchers: Watchers = {
    disabled: 'onDisabledChanged',
  };

  /**
   * The underlying form control element (input, select, etc.)
   * Subclasses should set this to their specific element
   */
  protected fieldElement: FieldElement | null = null;

  protected resetBtn: HTMLButtonElement | null = null;
  protected clearBtn: HTMLButtonElement | null = null;

  protected readonly boundOnChange = () =>
    this.setValue(this.getValue(), { silent: false, action: 'change' });

  protected readonly boundOnReset = () => this.onReset();
  protected readonly boundOnClear = () => this.onClear();

  // Declare reactive properties for TypeScript
  declare value?: TValue;
  declare defaultValue?: TValue | string;
  declare resettable?: boolean;
  declare resetText?: string;
  declare clearable?: boolean;
  declare clearText?: string;
  declare size?: string;
  declare disabled?: boolean;

  /**
   * Lifecycle: Component connected to DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Lifecycle: Component disconnected from DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * Render action buttons (clear/reset) using this.builder.
   * Must be called from within a build() callback.
   */
  protected renderActionButtons(force: boolean = false) {
    this.renderClearButton(force);
    this.renderResetButton(force);
  }

  protected renderResetButton(force: boolean = false) {
    const { button } = tags;

    if (force || this.resettable) {
      this.resetBtn = button({
        className: 'reset-btn',
        textContent: this.resetText || '↺',
        title: t('buttons.reset', '↺'),
        '@click': this.boundOnReset,
      });
    }
  }

  protected renderClearButton(force: boolean = false) {
    const { button } = tags;

    if (force || this.clearable) {
      this.clearBtn = button({
        className: 'clear-btn',
        textContent: this.clearText || '✕',
        title: t('buttons.clear', '✕'),
        '@click': this.boundOnClear,
      });
    }
  }

  /**
   * Watcher for disabled property
   */
  protected onDisabledChanged(newValue: boolean) {
    if (this.fieldElement) {
      (this.fieldElement as HTMLInputElement | HTMLSelectElement).disabled = Boolean(newValue);
    }
  }

  /**
   * Render the field component
   * Override in subclass to provide custom rendering
   */
  render(): void {
    // Default implementation - subclasses can override
  }

  /**
   * Get current value from the field element
   * Default implementation returns the value property of fieldElement
   * Override in subclasses if needed (e.g., checkbox uses checked instead of value)
   *
   * @returns Current field value
   */
  protected getValue(): any {
    return this.fieldElement?.value || '';
  }

  /**
   * Write value to the underlying UI element and sync props
   * Subclasses must override this to update their specific UI element
   *
   * @param _value New value to write to the element
   */
  protected writeValue(_value: any): void {
    // Base implementation - subclasses override
  }

  /**
   * Get event payload for change events
   * Override in subclasses to customize event data (e.g., { checked, oldChecked } for checkbox)
   *
   * @param value New value
   * @param oldValue Previous value
   * @param action Action type
   * @returns Event payload object
   */
  protected getEventPayload(value: any, oldValue: any, action: FieldAction): Record<string, any> {
    return { value, oldValue, action };
  }

  /**
   * Update field value programmatically (internal method)
   * Subclasses should provide type-safe public wrappers (e.g., change() method)
   *
   * @param value New value
   * @param options.silent If true, won't emit change event (default: true)
   * @param options.action Action type for the event (default: 'change')
   */
  protected setValue(value: any, options?: { silent?: boolean; action?: FieldAction }): void {
    const oldValue = this.getValue();

    // Update property value
    this.value = value;

    // Write to UI element (DOM only)
    this.writeValue(value);

    // Emit event if not silent
    if (options?.silent === false) {
      const payload = this.getEventPayload(value, oldValue, options.action || 'change');
      this.emit('change', { detail: payload });
    }
  }

  /**
   * Reset field to specified value or default value
   *
   * @param value Value to reset to, defaults to defaultValue prop
   * @param options.silent If false, will emit reset event (default: true)
   */
  public reset(value?: any, options?: { silent?: boolean }): void {
    const resetValue = value !== undefined ? value : this.defaultValue;
    this.setValue(resetValue, { ...options, action: 'reset' });
  }

  /**
   * Clear the field value
   *
   * @param options.silent If false, will emit clear event (default: true)
   */
  public clear(options?: { silent?: boolean }): void {
    this.setValue('', { ...options, action: 'clear' });
  }

  /**
   * Handle clear button click
   * Clears the field and dispatches event
   */
  protected onClear(): void {
    this.clear({ silent: false });
  }

  /**
   * Handle reset button click
   * Resets to default value and dispatches event
   */
  protected onReset(): void {
    this.reset(undefined, { silent: false });
  }
}

export default AeicoField;
export type AeicoFieldProps = InferProps<typeof AeicoField>;
