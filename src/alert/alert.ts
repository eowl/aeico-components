import type { InferProps, Props } from 'aeico'
import styleVariables from '../styles/variables.css?inline'
import colorCSS from '../styles/color.css?inline'
import alertStyle from '../styles/components/alert.css?inline'
import AeicoComponent from '../aeico-component'
import { html } from 'aeico'
import { t } from 'aeico-localize'
import type { AlertColor, AlertSize, AlertVariant } from './defines'

/**
 * Alert Component
 * 
 * A customizable alert/notification component with multiple variants and sizes.
 * Supports dismissible alerts and icon display.
 * 
 * @example
 * ```typescript
 * // Using the static create method
 * const alert = Alert.create({
 *   variant: 'info',
 *   dismissible: true
 * })
 * alert.textContent = 'This is an informational message'
 * document.body.appendChild(alert)
 * ```
 * 
 * @example
 * ```html
 * <!-- Using as Web Component -->
 * <ae-alert variant="info">Information message</ae-alert>
 * <ae-alert variant="success" dismissible>Operation successful!</ae-alert>
 * <ae-alert variant="warning" size="sm">Small warning</ae-alert>
 * ```
 */
class Alert extends AeicoComponent {
  static props: Props = {
    color: { type: String },
    variant: { type: String },
    size: { type: String },
    dismissible: { type: Boolean },
    invisible: { type: Boolean }
  }

  protected static useStyles = ['alert']
  protected static styles = [styleVariables, colorCSS, alertStyle]

  declare color?: AlertColor
  declare variant?: AlertVariant
  declare size?: AlertSize
  declare dismissible?: boolean
  declare invisible?: boolean

  protected render() {
    return html(({ div, slot, button, span }) => {
      div({ 
        className: 'alert', 
        role: 'alert', 
        part: 'alert',
        style: { display: this.invisible ? 'none' : '' } 
      }, () => {
        slot()

        if (this.dismissible) {
          button({
            className: 'alert-close',
            '@click': () => this._handleClose(),
            title: t('alert.close', 'Close alert'),
          }, () => {
            span({ 'aria-hidden': 'true', textContent: '\u00d7' })
          })
        }
      })
    })
  }

  show() {
    if (this.invisible) {
      this.invisible = false
    }
  }

  hide() {
    this.invisible = true
  }

  private _handleClose = () => {
    this.emit('alert-close', { detail: { target: this } })
    this.remove()
  }
}

Alert.register()

declare global {
  interface HTMLElementTagNameMap {
    'ae-alert': Alert
  }
}

export default Alert
export type AlertProps = InferProps<typeof Alert>
