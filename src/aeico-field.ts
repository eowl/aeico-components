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
    label: { type: String },
    labelPlacement: { type: String },
    required: { type: Boolean },
    helperText: { type: String },
    error: { type: String },
  };

  /**
   * Property watchers
   */
  static watchers: Watchers = {
    disabled: 'onDisabledChanged',
    error: 'onErrorChanged',
  };

  private static _fieldIdCounter = 0;
  private readonly _fieldId: string;

  constructor() {
    super();
    this._fieldId = `ae-field-${++AeicoField._fieldIdCounter}`;
  }

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
  declare label?: string;
  declare labelPlacement?: 'top' | 'left';
  declare required?: boolean;
  declare helperText?: string;
  declare error?: string;

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
   * Returns a stable unique ID for this field instance,
   * used to associate <label htmlFor> with the underlying input.
   */
  protected getFieldId(): string {
    return this._fieldId;
  }

  /**
   * Renders a <label> element when the `label` prop is set.
   * Call this as the first statement inside the render() html() callback.
   * @param fieldId - The id to set on the underlying form control element (pass to input via id prop)
   */
  protected renderLabel(fieldId: string): void {
    if (!this.label) return;
    const { span } = tags;
    tags.label({ id: `${fieldId}-label`, className: 'field-label', 'for': fieldId }, () => {
      span({ textContent: this.label! });
      if (this.required) {
        span({ className: 'field-required', 'aria-hidden': 'true', textContent: ' *' });
      }
    });
  }

  /**
   * Renders helper text below the field. Hidden when `error` is set.
   * Call this after the field-body div in render().
   */
  protected renderHelperText(): void {
    if (!this.helperText || this.error) return;
    const { span } = tags;
    span({ className: 'field-helper', textContent: this.helperText });
  }

  /**
   * Renders an error message below the field when `error` is set.
   * Call this after renderHelperText() in render().
   */
  protected renderError(): void {
    if (!this.error) return;
    const { span } = tags;
    span({ className: 'field-error', textContent: this.error });
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
   * Watcher for error property — syncs aria-invalid on the field element
   */
  protected onErrorChanged(newValue: string | undefined): void {
    if (this.fieldElement) {
      if (newValue) {
        this.fieldElement.setAttribute('aria-invalid', 'true');
      } else {
        this.fieldElement.removeAttribute('aria-invalid');
      }
    }
  }

  /**
   * Lifecycle: called after every render update.
   * Keeps aria-invalid on fieldElement in sync regardless of watcher timing.
   */
  protected onUpdated(_changedProps: Map<string, unknown>): void {
    if (!this.fieldElement) return;
    if (this.error) {
      this.fieldElement.setAttribute('aria-invalid', 'true');
    } else {
      this.fieldElement.removeAttribute('aria-invalid');
    }
  }

  /**
   * Returns true if the field passes constraint validation.
   * Delegates to the underlying fieldElement when available;
   * falls back to a manual required-check otherwise.
   */
  public checkValidity(): boolean {
    if (this.fieldElement) {
      return this.fieldElement.checkValidity();
    }
    if (this.required) {
      const v = this.value;
      return v !== undefined && v !== '' && v !== null;
    }
    return true;
  }

  /**
   * Reports validity, showing the browser's built-in validation UI when possible.
   */
  public reportValidity(): boolean {
    if (this.fieldElement) {
      return this.fieldElement.reportValidity();
    }
    return this.checkValidity();
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
  protected getValue(): TValue {
    return (this.fieldElement?.value || '') as TValue;
  }

  /**
   * Write value to the underlying UI element and sync props
   * Subclasses must override this to update their specific UI element
   *
   * @param _value New value to write to the element
   */
  protected writeValue(_value: TValue): void {
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
  protected getEventPayload(
    value: TValue,
    oldValue: TValue,
    action: FieldAction,
  ): Record<string, unknown> {
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
  protected setValue(value: TValue, options?: { silent?: boolean; action?: FieldAction }): void {
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
  public reset(value?: TValue, options?: { silent?: boolean }): void {
    const resetValue = value !== undefined ? value : this.defaultValue;
    this.setValue(resetValue as TValue, { ...options, action: 'reset' });
  }

  /**
   * Clear the field value
   *
   * @param options.silent If false, will emit clear event (default: true)
   */
  public clear(options?: { silent?: boolean }): void {
    this.setValue('' as TValue, { ...options, action: 'clear' });
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
