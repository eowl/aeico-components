import AeicoField from '../aeico-field'
import type { InferProps } from 'aeico'
import { html, tags } from 'aeico'
import type { NormalizedOption, SliderMarks, SliderOption, SliderOptions } from './defines'
import style from '../styles/components/slider.css?inline'
import variables from '../styles/variables.css?inline'
import sizeCSS from '../styles/size.css?inline'
import colorCSS from '../styles/color.css?inline'
import { prop } from 'aeico'

class Slider extends AeicoField {
  protected fieldElement: HTMLInputElement | null = null
  private _valueLabel: HTMLSpanElement | null = null
  private _numberInput: HTMLInputElement | null = null

  private _boundOnRangeInput: () => void
  private _boundOnNumberInput: () => void

  static tagName = 'slider'

  @prop({ type: Array })
  accessor options: SliderOptions = []

  @prop({ type: Boolean })
  accessor percentage = false

  @prop({ type: Number })
  accessor min = 0

  @prop({ type: Number })
  accessor max = 100

  @prop({ type: Number })
  accessor step = 1

  @prop({ type: Boolean })
  accessor editable = false

  @prop({ type: Boolean })
  accessor tracked = false

  @prop({
    type: Array,
    // bare attribute (<ae-slider marks>) → true; JSON array → MarkItem[]
    parser: (value: string | null) => {
      if (value === null) return undefined
      if (value === '' || value === 'true') return true
      if (value === 'false') return false
      try { return JSON.parse(value) } catch { return true }
    },
  })
  accessor marks: SliderMarks | undefined

  protected static styles = [variables, sizeCSS, colorCSS, style]

  constructor() {
    super()
    this._boundOnRangeInput = this._onRangeInput.bind(this)
    this._boundOnNumberInput = this._onNumberInput.bind(this)
  }

  private _normalizeOptions(): NormalizedOption[] | null {
    if (!Array.isArray(this.options) || this.options.length === 0) return null

    const opts = this.options.map(opt =>
      this._isSliderOption(opt)
        ? { label: opt.label, value: String(opt.value) }
        : { label: String(opt), value: String(opt) }
    )

    // Sort by numeric value if all values are numeric; otherwise keep original order
    const allNumeric = opts.every(o => o.value !== '' && !isNaN(Number(o.value)))

    if (allNumeric) {
      return [...opts]
        .sort((a, b) => Number(a.value) - Number(b.value))
        .map(o => ({ ...o, rangeValue: Number(o.value) }))
    } else {
      return opts.map((o, i) => ({ ...o, rangeValue: i }))
    }
  }

  private _getRangeAttrs(normalized: NormalizedOption[] | null): {
    min: string; max: string; step: string; inOptionsMode: boolean
  } {
    if (normalized && normalized.length >= 1) {
      const vals = normalized.map(o => o.rangeValue)
      const min = Math.min(...vals)
      const max = Math.max(...vals)

      // Compute step from minimum gap between adjacent sorted values
      const sorted = [...vals].sort((a, b) => a - b)
      let minGap = Infinity
      for (let i = 1; i < sorted.length; i++) {
        const d = sorted[i] - sorted[i - 1]
        if (d > 0 && d < minGap) minGap = d
      }

      return {
        min: String(min),
        max: String(max),
        step: minGap === Infinity ? '1' : String(minGap),
        inOptionsMode: true,
      }
    }

    return {
      min: String(this.min),
      max: String(this.max),
      step: String(this.step),
      inOptionsMode: false,
    }
  }

  private _toRangeValue(value: string | undefined, normalized: NormalizedOption[] | null): string {
    if (value == null || value === '') return ''
    if (normalized) {
      const found = normalized.find(o => o.value === value)

      return found !== undefined ? String(found.rangeValue) : ''
    }

    return value
  }

  private _fromRangeValue(rv: string, normalized: NormalizedOption[] | null): string {
    if (normalized) {
      const n = Number(rv)

      return normalized.find(o => o.rangeValue === n)?.value ?? normalized[0]?.value ?? rv
    }
    return rv
  }

  private _displayLabel(value: string | undefined, normalized: NormalizedOption[] | null): string {
    if (value == null || value === '') return ''
    const label = normalized
      ? (normalized.find(o => o.value === value)?.label ?? value)
      : value

    return this.percentage ? `${label}%` : label
  }


  private _maxValueLabelWidth(
    normalized: NormalizedOption[] | null,
    attrs: { min: string; max: string },
  ): string {
    const candidates = normalized
      ? normalized.map(o => this._displayLabel(o.value, normalized))
      : [this._displayLabel(attrs.min, null), this._displayLabel(attrs.max, null)]
    const maxLen = Math.max(...candidates.map(l => l.length), 1)

    return `${maxLen}ch`
  }

  private _updateTrackFill(): void {
    if (!this.tracked || !this.fieldElement) return
    const min = Number(this.fieldElement.min)
    const max = Number(this.fieldElement.max)
    const val = Number(this.fieldElement.value)
    const range = max - min || 1
    const pct = Math.max(0, Math.min(100, ((val - min) / range) * 100))
    this.style.setProperty('--fill-pct', `${pct}%`)
  }

  private _getMarksData(
    normalized: NormalizedOption[] | null,
    attrs: { min: string; max: string; inOptionsMode: boolean },
  ): Array<{ value: string; label: string; pct: number }> {
    const minVal = Number(attrs.min)
    const maxVal = Number(attrs.max)
    const range = maxVal - minVal || 1

    const marks = this.marks

    // Custom marks array — purely visual, no snapping effect
    if (Array.isArray(marks)) {
      const result: Array<{ value: string; label: string; pct: number }> = []
      for (const m of marks) {
        const isObj = m !== null && typeof m === 'object'
        const numVal = isObj ? (m as { value: number }).value : (m as number)
        if (numVal < minVal || numVal > maxVal) continue
        const rawLabel = isObj
          ? ((m as { value: number; label?: string }).label ?? String(numVal))
          : String(numVal)
        result.push({
          value: String(numVal),
          label: this.percentage ? `${rawLabel}%` : rawLabel,
          pct: ((numVal - minVal) / range) * 100,
        })
      }
      
      return result
    }

    // marks === true — auto-generate from options or free-mode endpoints
    if (normalized) {
      return normalized.map(o => ({
        value: o.value,
        label: this.percentage ? `${o.label}%` : o.label,
        pct: ((o.rangeValue - minVal) / range) * 100,
      }))
    }

    // Free mode — show min and max endpoints only
    return [
      { value: attrs.min, label: this.percentage ? `${minVal}%` : String(minVal), pct: 0 },
      { value: attrs.max, label: this.percentage ? `${maxVal}%` : String(maxVal), pct: 100 },
    ]
  }

  protected writeValue(value: string): void {
    const normalized = this._normalizeOptions()
    const rv = this._toRangeValue(value, normalized)

    if (this.fieldElement && rv !== '' && this.fieldElement.value !== rv) {
      this.fieldElement.value = rv
    }

    if (this._valueLabel) {
      this._valueLabel.textContent = this._displayLabel(value, normalized)
    }

    // Sync number input only in free mode (options mode disables it)
    if (this._numberInput && !normalized && this._numberInput.value !== rv) {
      this._numberInput.value = rv
    }

    this._updateTrackFill()
  }

  protected getValue(): string {
    if (!this.fieldElement) return ''

    return this._fromRangeValue(this.fieldElement.value, this._normalizeOptions())
  }

  render() {
    const normalized = this._normalizeOptions()
    const attrs = this._getRangeAttrs(normalized)

    return html(({ div, input, span }) => {
      div({ className: 'range-container' }, () => {
        // Wrap range + optional marks in a column so marks don't push siblings
        div({ key: 'range-wrapper', className: 'range-wrapper' }, () => {
          this.fieldElement = input({
            key: 'range',
            type: 'range',
            min: attrs.min,
            max: attrs.max,
            step: attrs.step,
            '@input': this._boundOnRangeInput,
            '@change': this.boundOnChange,
          }) as HTMLInputElement

          if (this.marks) {
            const marksData = this._getMarksData(normalized, attrs)
            div({ key: 'marks', className: 'marks-container' }, () => {
              for (const m of marksData) {
                tags.span({
                  key: `mark-${m.value}`,
                  className: 'mark',
                  style: { left: `${m.pct}%` },
                }, () => {
                  tags.span({ className: 'mark-label', textContent: m.label })
                })
              }
            })
          }
        })

        this._valueLabel = span({
          key: 'label',
          className: 'value-label',
          style: { minWidth: this._maxValueLabelWidth(normalized, attrs) },
          textContent: this._displayLabel(this.value, normalized),
        }) as HTMLSpanElement

        // Action buttons first so the number input can be toggled without disrupting button reuse
        this.renderActionButtons()

        if (this.editable) {
          this._numberInput = input({
            key: 'number',
            type: 'number',
            className: 'value-input',
            min: attrs.min,
            max: attrs.max,
            step: attrs.step,
            // Disabled in options mode: valid values are discrete, free text makes no sense
            disabled: attrs.inOptionsMode,
            '@input': this._boundOnNumberInput,
          }) as HTMLInputElement
        } else {
          this._numberInput = null
        }
      })

      if (this.value != null) this.writeValue(this.value)
    })
  }

  private _onRangeInput(): void {
    if (!this.fieldElement) return

    const normalized = this._normalizeOptions()
    const actualValue = this._fromRangeValue(this.fieldElement.value, normalized)

    if (this._valueLabel) {
      this._valueLabel.textContent = this._displayLabel(actualValue, normalized)
    }
    // Keep number input in sync during drag
    if (this._numberInput && !normalized) {
      this._numberInput.value = this.fieldElement.value
    }

    this._updateTrackFill()
  }

  private _onNumberInput(): void {
    if (!this._numberInput || !this.fieldElement) return
    const v = this._numberInput.value

    if (this.fieldElement.value === v) return

    this.fieldElement.value = v
    if (this._valueLabel) {
      this._valueLabel.textContent = this._displayLabel(v, null)
    }
  }

  public clear(options?: { silent?: boolean }): void {
    const normalized = this._normalizeOptions()
    const attrs = this._getRangeAttrs(normalized)
    // Reset to the option whose rangeValue === min, or to attrs.min in free mode
    const clearTo = normalized
      ? (normalized.find(o => String(o.rangeValue) === attrs.min)?.value ?? normalized[0]?.value ?? attrs.min)
      : attrs.min
    this.setValue(clearTo, { ...options, action: 'clear' })
  }

  private _isSliderOption(opt: unknown): opt is SliderOption {
    return opt !== null && typeof opt === 'object' && 'label' in (opt as object) && 'value' in (opt as object)
  }
}

Slider.register()

declare global {
  interface HTMLElementTagNameMap {
    'ae-slider': Slider
  }
}

export default Slider
export type SliderProps = InferProps<typeof Slider>
