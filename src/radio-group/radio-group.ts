import AeicoField from '../aeico-field';
import type { InferProps, Props } from 'aeico';
import { html, tags } from 'aeico';
import type { ButtonColor, ButtonVariant, ButtonSize } from '../button';
import type { RadioGroupMode, RadioGroupOption, RadioGroupOptions } from './defines';
import Radio from './radio';
import style from '../styles/components/radio-group.css';
import variables from '../styles/variables.css';
import sizeCSS from '../styles/size.css';
import colorCSS from '../styles/color.css';
import fieldLabelCSS from '../styles/components/field-label.css';
import actionButtonCSS from '../styles/components/action-button.css';

class RadioGroup extends AeicoField {
  protected fieldElement: HTMLInputElement | null = null;

  private _slotEl: HTMLSlotElement | null = null;
  private _slotOptions: Radio[] = [];

  private static _instanceCount = 0;
  private readonly _groupName: string;

  static tagName = 'radio-group';

  static props: Props = {
    options: { type: Array },
    mode: { type: String },
    color: { type: String },
    variant: { type: String },
    size: { type: String },
    allowEmpty: { type: Boolean },
    actionButtonStyle: { type: String },
  };

  declare options?: RadioGroupOptions;
  declare mode?: RadioGroupMode;
  declare color?: ButtonColor;
  declare variant?: ButtonVariant;
  declare size?: ButtonSize;
  declare allowEmpty?: boolean;

  protected static styles = [variables, sizeCSS, colorCSS, fieldLabelCSS, actionButtonCSS, style];

  constructor() {
    super();
    this._groupName = `rg-${++RadioGroup._instanceCount}`;
  }

  private _optLabel(opt: RadioGroupOption): string {
    if (opt !== null && typeof opt === 'object') {
      return String(opt.label);
    }
    return String(opt);
  }

  private _optValue(opt: RadioGroupOption): string {
    if (opt !== null && typeof opt === 'object') return String(opt.value);
    return String(opt);
  }

  private _allOptions(): Array<{ label: string; value: string; disabled?: boolean }> {
    const from_props = (Array.isArray(this.options) ? this.options : []).map((o) => ({
      label: this._optLabel(o),
      value: this._optValue(o),
    }));

    const from_slot = this._slotOptions.map((el) => ({
      label: el.textContent?.trim() || el.value,
      value: el.value,
      disabled: el.disabled,
    }));

    return [...from_props, ...from_slot];
  }

  private _onSlotChange(): void {
    if (!this._slotEl) return;

    this._slotOptions = (this._slotEl.assignedElements({ flatten: true }) as HTMLElement[]).filter(
      (el) => el.tagName.toLowerCase() === 'ae-radio',
    ) as Radio[];
    this.update();
  }

  // Single handler for radio inputs — handles both select and deselect.
  // Only uses `click` (not `change`) because `change` fires before `click`;
  // if we set value in `change`, the `click` handler would see the updated
  // value and immediately deselect.
  private _boundOnRadioClick = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const current = this.value ?? '';
    if (input.value === current) {
      if (this.allowEmpty) {
        input.checked = false;
        this.setValue('', { silent: false, action: 'change' });
      }
      // !allowEmpty: do nothing
    } else {
      this.setValue(input.value, { silent: false, action: 'change' });
    }
  };

  private _boundOnButtonClick = (e: Event) => {
    const btn = e.currentTarget as HTMLElement;
    const val = btn.dataset.value ?? '';
    const current = this.value ?? '';
    // Toggle off if clicking already-selected option
    if (val === current) {
      if (this.allowEmpty) {
        this.setValue('', { silent: false, action: 'change' });
      }
      // !allowEmpty: already selected, do nothing
    } else {
      this.setValue(val, { silent: false, action: 'change' });
    }
  };

  protected getValue(): string {
    return this.value ?? '';
  }

  protected writeValue(_value: string): void {
    // All visual state is driven by builder diff on next render;
    // for native radio inputs we need to sync checked immediately.
    // The render() reads this.value, so update handles the rest.
  }

  protected onReset(): void {
    this.setValue(this.defaultValue ?? '', { silent: false, action: 'reset' });
  }

  protected onClear(): void {
    this.setValue('', { silent: false, action: 'clear' });
  }

  render() {
    const mode = (this.mode as RadioGroupMode) || 'default';
    const opts = this._allOptions();
    const current = this.value ?? '';

    return html(({ div, slot }) => {
      const id = this.getFieldId();
      this.renderLabel(id);
      div({ id, role: 'group', className: 'rg-container field-body' }, () => {
        if (mode === 'default') {
          this._renderRadio(opts, current);
          this.renderActionButtons();
        } else {
          this._renderButtons(opts, current, mode);
        }
      });

      if (mode !== 'default') {
        if (this.allowEmpty) this.renderClearButton();
        this.renderResetButton();
      }

      // Hidden slot — captures <option> light DOM children
      this._slotEl = slot({
        style: { display: 'none' },
        '@slotchange': () => this._onSlotChange(),
      });

      this.renderHelperText();
      this.renderError();
    });
  }

  private _renderRadio(
    opts: Array<{ label: string; value: string; disabled?: boolean }>,
    current: string,
  ): void {
    const { label, input, span } = tags;
    for (const opt of opts) {
      const isChecked = opt.value === current;

      label({ key: `opt-${opt.value}`, className: 'rg-radio-option' }, () => {
        const el = input({
          type: 'radio',
          className: 'rg-radio-input',
          name: this._groupName,
          value: opt.value,
          disabled: Boolean(this.disabled) || Boolean(opt.disabled),
          required: Boolean(this.required),
          '@click': this._boundOnRadioClick,
        });
        // Sync DOM property directly — setAttribute('checked') doesn't work
        // after user interaction; only the .checked property controls state.
        el.checked = isChecked;
        // Keep fieldElement pointing to first radio for base-class compat
        if (!this.fieldElement) this.fieldElement = el;
        span({ className: 'rg-radio-label', textContent: opt.label });
      });
    }
  }

  private _renderButtons(
    opts: Array<{ label: string; value: string; disabled?: boolean }>,
    current: string,
    mode: RadioGroupMode,
  ): void {
    const { button } = tags;
    const count = opts.length;
    for (let i = 0; i < count; i++) {
      const opt = opts[i];
      const isSelected = opt.value === current;

      // Position class for button-group border-radius (CSS handles all styling)
      let posClass = '';
      if (mode === 'button-group') {
        if (count === 1) posClass = ' only';
        else if (i === 0) posClass = ' first';
        else if (i === count - 1) posClass = ' last';
        else posClass = ' inner';
      }

      button({
        key: `opt-${opt.value}`,
        className: `rg-btn${isSelected ? ' selected' : ''}${posClass}`,
        textContent: opt.label,
        disabled: Boolean(this.disabled) || Boolean(opt.disabled),
        'data-value': opt.value,
        '@click': this._boundOnButtonClick,
      });
    }
  }
}

RadioGroup.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-radio-group': RadioGroup;
  }
}

export default RadioGroup;
export type RadioGroupProps = InferProps<typeof RadioGroup>;
