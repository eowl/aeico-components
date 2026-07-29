import AeicoField from '../aeico-field';
import type { InferProps } from 'aeico';
import { html, tags } from 'aeico';
import type {
  SelectOptionValue,
  SelectOption,
  SelectOptions,
  SelectPosition,
  SelectMultiValue,
} from './defines';
import style from '../styles/components/select.css';
import variables from '../styles/variables.css';
import sizeCSS from '../styles/size.css';
import fieldLabelCSS from '../styles/components/field-label.css';
import actionButtonCSS from '../styles/components/action-button.css';
import SelectOptionElement from './select-option';
import '../tag/tag';
import { prop } from 'aeico';

/**
 * Select component supporting single and multi-select modes, with options provided via both props and slots.
 * - `options` prop accepts an array of strings or objects with `value` and `label` for programmatic options.
 * - Slot content allows for declarative options using `<ae-select-option>` elements.
 * @example
 * <ae-select placeholder="Choose an option" position="bottom">
 *   <ae-select-option value="1" label="Option 1">Option 1</ae-select-option>
 *   <ae-select-option value="2" label="Option 2">Option 2</ae-select-option>
 * </ae-select>
 *
 */
class Select extends AeicoField<SelectOptionValue | SelectMultiValue> {
  protected fieldElement: HTMLInputElement | null = null;
  private _isOpen = false;
  private _triggerEl: HTMLElement | null = null;
  private _dropdownEl: HTMLElement | null = null;
  private _slotEl: HTMLSlotElement | null = null;
  private _slotOptionData: Array<{ value: string; label: string }> = [];
  private _selectedListEl: HTMLElement | null = null;


  @prop({ type: Boolean, observe: false, reflect: false })
  accessor _expanded: boolean = false;

  @prop({ type: Array })
  accessor options: SelectOptions | undefined;

  @prop({ type: String })
  accessor position: SelectPosition | undefined;

  @prop({ type: String })
  accessor placeholder: string | undefined;

  @prop({ type: Boolean })
  accessor multiple: boolean = false;

  @prop({ type: Boolean })
  accessor expandable: boolean = false;

  // Override base class value prop to support both string and array (multi-select).
  // Uses field decorator (not accessor) because TypeScript TS2611 disallows overriding
  // a parent class data property (declare value?) with an accessor in a subclass.
  @prop({
    type: String,
    parser: (v) => {
      if (v === null || v === undefined) return undefined;
      try {
        return JSON.parse(v);
      } catch {
        return v;
      }
    },
    formatter: (v) => {
      if (v === null || v === undefined) return '';
      if (Array.isArray(v)) return JSON.stringify(v);
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      return String(v);
    },
  })
  override value: SelectOptionValue | SelectMultiValue | undefined = undefined;

  // Override base class defaultValue so arrays are JSON-serialized to the attribute,
  // matching the value prop's parser/formatter. Without this override, setting
  // defaultValue = ['a', 'b'] would be serialized as String(['a','b']) = "a,b",
  // and reset() would restore a single string "a,b" instead of the array.
  @prop({
    type: String,
    parser: (v) => {
      if (v === null || v === undefined) return undefined;
      try {
        return JSON.parse(v);
      } catch {
        return v;
      }
    },
    formatter: (v) => {
      if (v === null || v === undefined) return '';
      if (Array.isArray(v)) return JSON.stringify(v);
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      return String(v);
    },
  })
  override defaultValue: SelectOptionValue | SelectMultiValue | undefined = undefined;

  protected static styles = [variables, sizeCSS, fieldLabelCSS, actionButtonCSS, style];

  protected writeValue(_value: SelectOptionValue | SelectMultiValue): void {
    // Reactive re-render via this.value prop change handles the display update
  }

  protected getValue(): SelectOptionValue | SelectMultiValue {
    if (this.multiple) return this._getMultiValues();

    return this.value || '';
  }

  private _getMultiValues(): SelectMultiValue {
    if (Array.isArray(this.value)) return this.value;
    if (this.value != null && this.value !== '') return [this.value];

    return [];
  }

  protected onDisabledChanged(_newValue: boolean): void {
    // disabled is a reactive prop — render() already picks it up automatically
  }

  protected onUpdated(changedProps: Map<string, unknown>): void {
    super.onUpdated(changedProps);
    if (!this.multiple || this.expandable) {
      if (this._expanded) this._expanded = false;
      return;
    }
    const list = this._selectedListEl;
    if (!list) return;
    const overflowing = list.scrollWidth > list.clientWidth + 1;
    if (overflowing !== this._expanded) this._expanded = overflowing;
  }

  private _findLabel(value: SelectOptionValue): string {
    const strVal = String(value);
    if (Array.isArray(this.options)) {
      for (const opt of this.options) {
        if (this._isSelectOption(opt)) {
          if (String(opt.value) === strVal) return opt.label;
        } else {
          if (String(opt) === strVal) return strVal;
        }
      }
    }

    for (const opt of this._slotOptionData) {
      if (opt.value === strVal) return opt.label;
    }

    return strVal;
  }

  private _onSlotChange(): void {
    if (!this._slotEl) return;
    const data: Array<{ value: string; label: string }> = [];
    for (const el of this._slotEl.assignedElements({ flatten: true })) {
      if (el.tagName.toLowerCase() !== 'ae-select-option') continue;
      const optEl = el as SelectOptionElement;
      data.push({
        value: optEl.value ?? el.getAttribute('value') ?? '',
        label: optEl.label || el.textContent?.trim() || '',
      });
    }
    this._slotOptionData = data;
    this.update();
  }

  private _toggleDropdown(): void {
    if (this._isOpen) {
      this._closeDropdown();
    } else {
      this._openDropdown();
    }
  }

  private _openDropdown(): void {
    this._isOpen = true;
    this._syncOpenState();
  }

  private _closeDropdown(): void {
    this._isOpen = false;
    this._syncOpenState();
  }

  private _syncOpenState(): void {
    this._triggerEl?.classList.toggle('open', this._isOpen);
    this._dropdownEl?.classList.toggle('open', this._isOpen);
  }

  private readonly _handleOutsideClick = (e: Event): void => {
    if (!e.composedPath().includes(this)) {
      this._closeDropdown();
    }
  };

  private readonly _handleOptionSelect = (e: Event): void => {
    const { value, label } = (e as CustomEvent<{ value: string; label: string }>).detail;
    if (!this._slotOptionData.find((o) => o.value === value)) {
      this._slotOptionData = [
        ...this._slotOptionData.filter((o) => o.value !== value),
        { value, label },
      ];
    }
    if (this.multiple) {
      const current = this._getMultiValues();
      const idx = current.findIndex((v) => String(v) === value);
      const next: SelectMultiValue =
        idx >= 0 ? current.filter((_, i) => i !== idx) : [...current, value];

      this.setValue(next, { silent: false, action: 'change' });
    } else {
      this.setValue(value, { silent: false, action: 'change' });
      this._closeDropdown();
    }
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._handleOutsideClick);
    this.addEventListener('selectoption', this._handleOptionSelect);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleOutsideClick);
    this.removeEventListener('selectoption', this._handleOptionSelect);
  }

  private _syncSlotOptionsSelected(): void {
    if (!this._slotEl) return;
    const multiValues = this._getMultiValues();
    for (const el of this._slotEl.assignedElements({ flatten: true })) {
      if (el.tagName.toLowerCase() !== 'ae-select-option') continue;
      const optEl = el as SelectOptionElement;
      const optVal = optEl.value ?? el.getAttribute('value') ?? '';
      const isSelected = this.multiple
        ? multiValues.some((v) => String(v) === optVal)
        : this.value != null && this.value !== '' && String(this.value) === optVal;
      // undefined triggers removeAttribute via reactive setter
      // (null would work too but undefined is type-safe for boolean | undefined)
      optEl.selected = isSelected ? true : undefined;
    }
  }

  render() {
    const position = this.position || 'bottom';
    const multiValues = this.multiple ? this._getMultiValues() : [];
    const hasMultiSelection = this.multiple && multiValues.length > 0;
    const selectedLabel =
      !this.multiple && this.value != null && this.value !== ''
        ? this._findLabel(this.value as SelectOptionValue)
        : '';
    const isDisabled = Boolean(this.disabled);
    this._selectedListEl = null;

    this._syncSlotOptionsSelected();

    return html(({ div, span, slot }) => {
      const id = this.getFieldId();
      this.renderLabel(id);
      div(
        {
          id,
          'aria-labelledby': this.label ? `${id}-label` : undefined,
          className: 'container field-body',
        },
        () => {
          this._triggerEl = div(
            {
              className: `trigger${this._isOpen ? ' open' : ''}${isDisabled ? ' disabled' : ''}`,
              '@click': () => {
                if (isDisabled) return;

                this._toggleDropdown();
              },
            },
            () => {
              if (this.multiple) {
                if (hasMultiSelection) {
                  this._selectedListEl = div(
                    {
                      className: `selected-list${!this.expandable ? ' selected-list--clipped' : ''}`,
                    },
                    () => {
                      for (const v of multiValues) {
                        const lbl = this._findLabel(v);
                        tags.aeTag({
                          key: `sel-${v}`,
                          color: 'default',
                          variant: 'faint',
                          dismissible: true,
                          disabled: isDisabled,
                          textContent: lbl,
                          '@dismiss': (e: Event) => {
                            e.stopPropagation();
                            if (isDisabled) return;

                            const next = multiValues.filter((item) => String(item) !== String(v));
                            this.setValue(next, { silent: false, action: 'change' });
                          },
                        });
                      }
                    },
                  );
                  if (!this.expandable && this._expanded) {
                    span({ className: 'overflow-indicator', textContent: '…' });
                  }
                } else {
                  span({ className: 'value placeholder', textContent: this.placeholder || '' });
                }
              } else {
                if (selectedLabel) {
                  span({ className: 'value', textContent: selectedLabel });
                } else {
                  span({ className: 'value placeholder', textContent: this.placeholder || '' });
                }
              }
              span({ className: 'arrow', textContent: '▾' });
            },
          );

          this._dropdownEl = div(
            {
              className: `dropdown position-${position}${this._isOpen ? ' open' : ''}`,
            },
            () => {
              this._renderProgrammaticOptions();
              this._slotEl = slot({
                '@slotchange': () => this._onSlotChange(),
              });
            },
          );

          this.renderActionButtons();
        },
      );
      this.renderHelperText();
      this.renderError();

      // Visually-hidden input so native form constraint validation works for `required`.
      // type="text" (not "hidden") is required — type="hidden" is exempt from constraint validation.
      const currentValue =
        this.value != null &&
        this.value !== '' &&
        !(Array.isArray(this.value) && this.value.length === 0)
          ? String(this.value)
          : '';
      this.fieldElement = tags.input({
        key: 'validation-input',
        type: 'text',
        'aria-hidden': 'true',
        tabIndex: -1,
        required: Boolean(this.required),
        value: currentValue,
        style: {
          position: 'absolute',
          width: '0',
          height: '0',
          opacity: '0',
          margin: '0',
          padding: '0',
          border: '0',
          pointerEvents: 'none',
          overflow: 'hidden',
        },
      });
    });
  }

  private _renderProgrammaticOptions(): void {
    if (!Array.isArray(this.options)) return;

    const { aeSelectOption } = tags;
    const multiValues = this.multiple ? this._getMultiValues() : [];
    for (const opt of this.options) {
      if (this._isSelectOption(opt)) {
        const isSelected = this.multiple
          ? multiValues.some((v) => String(v) === String(opt.value))
          : this.value != null && String(opt.value) === String(this.value);
        aeSelectOption({
          key: `opt-${opt.value}`,
          value: String(opt.value),
          label: opt.label,
          textContent: opt.label,
          selected: isSelected ? true : undefined,
        });
      } else {
        const isSelected = this.multiple
          ? multiValues.some((v) => String(v) === String(opt))
          : this.value != null && String(opt) === String(this.value);
        aeSelectOption({
          key: `opt-${opt}`,
          value: String(opt),
          textContent: String(opt),
          selected: isSelected ? true : undefined,
        });
      }
    }
  }

  private _isSelectOption(option: unknown): option is SelectOption {
    return (
      option !== null &&
      typeof option === 'object' &&
      typeof (option as SelectOption).label === 'string' &&
      (typeof (option as SelectOption).value === 'string' ||
        typeof (option as SelectOption).value === 'number')
    );
  }
}

Select.define('select');

declare global {
  interface HTMLElementTagNameMap {
    'ae-select': Select;
  }
}

export default Select;
export type SelectProps = InferProps<typeof Select>;
