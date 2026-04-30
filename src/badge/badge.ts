import type { InferProps } from 'aeico'
import styleVariables from '../styles/variables.css?inline'
import sizeCSS from '../styles/size.css?inline'
import colorCSS from '../styles/color.css?inline'
import badgeStyle from '../styles/components/badge.css?inline'
import AeicoComponent from '../aeico-component'
import { html } from 'aeico'
import type { BadgeColor, BadgeSize, BadgeVariant } from './defines'
import { prop } from 'aeico'

/**
 * Badge Component
 *
 * A small inline label for status, category, or count indicators.
 * Supports color, variant, size, and an optional leading/trailing ae-icon slot.
 *
 * @example
 * ```html
 * <ae-badge color="primary">New</ae-badge>
 * <ae-badge variant="outlined" color="success">Active</ae-badge>
 * <ae-badge variant="subtle" color="danger" size="sm">
 *   <ae-icon slot="start" name="warning"></ae-icon>
 *   Error
 * </ae-badge>
 * ```
 */
class Badge extends AeicoComponent {
  protected static styles = [styleVariables, sizeCSS, colorCSS, badgeStyle]

  @prop({ type: String })
  accessor color: BadgeColor = 'default'

  @prop({ type: String })
  accessor variant: BadgeVariant = 'filled'

  @prop({ type: String })
  accessor size: BadgeSize = 'md'

  @prop({ type: Boolean })
  accessor pill: boolean = false

  protected render() {
    return html(({ span, slot }) => {
      span({ part: 'badge', className: 'badge' }, () => {
        slot({ name: 'start' })
        slot()
        slot({ name: 'end' })
      })
    })
  }
}

Badge.register()

declare global {
  interface HTMLElementTagNameMap {
    'ae-badge': Badge
  }
}

export default Badge
export type BadgeProps = InferProps<typeof Badge>
