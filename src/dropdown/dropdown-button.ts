import AeicoComponent from '../aeico-component'
import type { InferProps } from 'aeico'
import { html } from 'aeico'
import { prop } from 'aeico'
import type { ButtonColor, ButtonSize, ButtonVariant } from '../button/defines'
import type { DropdownPlacement } from './defines'
import type Dropdown from './dropdown'
import './dropdown'
import '../button/button'

/**
 * DropdownButton — a pre-composed trigger + dropdown panel.
 *
 * Renders an `ae-button`-styled trigger with a built-in chevron,
 * and a floating panel for `<ae-dropdown-item>` children.
 * Accepts the same `variant`, `color`, `size`, and `disabled` props
 * as `ae-button`, making it a drop-in inside `ae-button-group`.
 *
 * @example
 * ```html
 * <ae-dropdown-button variant="outlined" color="primary">
 *   Actions
 *   <ae-dropdown-item value="edit">Edit</ae-dropdown-item>
 *   <ae-dropdown-item value="delete">Delete</ae-dropdown-item>
 * </ae-dropdown-button>
 *
 * <!-- Inside ae-button-group -->
 * <ae-button-group compact color="primary">
 *   <ae-button>Save</ae-button>
 *   <ae-dropdown-button placement="bottom-end">
 *     <ae-dropdown-item value="draft">Save as draft</ae-dropdown-item>
 *     <ae-dropdown-item value="template">Save as template</ae-dropdown-item>
 *   </ae-dropdown-button>
 * </ae-button-group>
 * ```
 *
 * Emits:
 * - `open`   — when the panel opens
 * - `close`  — when the panel closes
 * - `select` — `{ detail: { value, label } }` when a menu item is selected
 */
class DropdownButton extends AeicoComponent {
  static tagName = 'dropdown-button'

  // ae-button and ae-dropdown each carry their own shadow DOM styles.
  // Only the host display is set here so button-group compact layout works.
  protected static styles = [
    ':host { display: inline-block; }',
    '.caret { display: inline-block; width: 0; height: 0; margin-left: 0.3em; vertical-align: 0.2em; flex-shrink: 0; }',
    '.caret--bottom { border-top: 0.35em solid; border-right: 0.35em solid transparent; border-left: 0.35em solid transparent; }',
    '.caret--top { border-bottom: 0.35em solid; border-right: 0.35em solid transparent; border-left: 0.35em solid transparent; }',
    '.caret--right { border-left: 0.35em solid; border-top: 0.35em solid transparent; border-bottom: 0.35em solid transparent; }',
    '.caret--left { border-right: 0.35em solid; border-top: 0.35em solid transparent; border-bottom: 0.35em solid transparent; }',
  ]

  @prop({ type: String })
  accessor variant: ButtonVariant = 'filled'

  @prop({ type: String })
  accessor color: ButtonColor = 'default'

  @prop({ type: String })
  accessor size: ButtonSize = 'md'

  @prop({ type: Boolean })
  accessor disabled: boolean = false

  @prop({ type: String })
  accessor placement: DropdownPlacement = 'bottom-start'

  @prop({ type: Boolean })
  accessor closeOnSelect: boolean = true

  private _dropdownEl: Dropdown | null = null

  show(): void { if (this.disabled) return; this._dropdownEl?.show() }
  hide(): void { this._dropdownEl?.hide() }
  toggle(): void { if (this.disabled) return; this._dropdownEl?.toggle() }

  get open(): boolean { return this._dropdownEl?.open ?? false }

  protected render() {
    const dir = this.placement.split('-')[0]
    return html(({ aeDropdown, aeButton, slot, span }) => {
      this._dropdownEl = aeDropdown({
        placement: this.placement,
        'close-on-select': this.closeOnSelect,
      }, () => {
        aeButton({
          slot: 'trigger',
          variant: this.variant,
          color: this.color,
          size: this.size,
          disabled: this.disabled || undefined,
        }, () => {
          slot({ name: 'label' })
          span({ className: `caret caret--${dir}`, 'aria-hidden': 'true' })
        })
        slot()
      }) as unknown as Dropdown
    })
  }
}

DropdownButton.register()

declare global {
  interface HTMLElementTagNameMap {
    'ae-dropdown-button': DropdownButton
  }
}

export default DropdownButton
export type DropdownButtonProps = InferProps<typeof DropdownButton>
