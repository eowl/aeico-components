import type { InferProps } from 'aeico'
import styleVariables from '../styles/variables.css?inline'
import sizeCSS from '../styles/size.css?inline'
import colorCSS from '../styles/color.css?inline'
import tagStyle from '../styles/components/tag.css?inline'
import AeicoComponent from '../aeico-component'
import { html } from 'aeico'
import type { TagColor, TagSize, TagVariant } from './defines'
import { prop } from 'aeico'

/**
 * Tag Component
 *
 * An inline label component with optional dismiss button.
 * Supports the same color, variant, and size options as Button.
 *
 * @example
 * ```html
 * <ae-tag color="primary" variant="faint">Label</ae-tag>
 * <ae-tag color="success" variant="outlined" dismissible>Removable</ae-tag>
 * <ae-tag color="danger" size="sm">
 *   <ae-icon slot="start" name="warning"></ae-icon>
 *   Error
 * </ae-tag>
 * ```
 */
class Tag extends AeicoComponent {
  protected static styles = [styleVariables, sizeCSS, colorCSS, tagStyle]

  @prop({ type: String })
  accessor color: TagColor | undefined

  @prop({ type: String })
  accessor variant: TagVariant | undefined

  @prop({ type: String })
  accessor size: TagSize | undefined

  @prop({ type: Boolean })
  accessor dismissible: boolean = false

  @prop({ type: Boolean })
  accessor disabled: boolean = false

  @prop({ type: Boolean })
  accessor pill: boolean = false

  protected render() {
    return html(({ span, button, slot }) => {
      span({ part: 'tag', className: 'tag' }, () => {
        slot({ name: 'start' })
        span({ className: 'tag-content' }, () => {
          slot()
        })
        slot({ name: 'end' })
        button({
          type: 'button',
          className: 'tag-dismiss',
          'aria-label': 'dismiss',
          '@click': (e: Event) => {
            e.stopPropagation()
            if (this.disabled) return
            this.emit('dismiss')
          },
        }, () => {
          span({ textContent: '\u00d7' })
        })
      })
    })
  }
}

Tag.register()

declare global {
  interface HTMLElementTagNameMap {
    'ae-tag': Tag
  }
}

export default Tag
export type TagProps = InferProps<typeof Tag>
