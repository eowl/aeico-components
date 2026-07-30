import AeicoComponent from '../aeico-component';
import type { InferProps } from 'aeico';
import styleVariables from '../styles/variables.css';
import colorCSS from '../styles/color.css';
import style from '../styles/components/divider.css';
import { prop } from 'aeico';
/**
 * A simple divider component that can be used to separate content. It supports both horizontal and vertical orientations, as well as customizable thickness and color.
 * @example
 * ```html
 * <ae-divider></ae-divider>
 * <ae-divider vertical></ae-divider>
 * <ae-divider thickness="4px" color="primary"></ae-divider>
 * ```
 * @props
 * - `vertical` (boolean): If true, the divider will be vertical. Default is false (horizontal).
 * - `thickness` (string): Custom thickness for the divider (e.g., "2px", "0.5rem"). If not provided, it will use the default thickness defined in CSS.
 * - `color` (string): Color variant for the divider (e.g., "primary", "secondary"). If not provided, it will use the default color defined in CSS.
 *
 * @csspart divider - The main divider element that can be styled.
 *
 * @cssproperty --thickness - Custom property to set the thickness of the divider when the `thickness` prop is used.
 */
class Divider extends AeicoComponent {
  @prop({ type: Boolean })
  accessor vertical: boolean = false;

  @prop({ type: String })
  accessor thickness: string | undefined;

  @prop({ type: String })
  accessor color: string | undefined;

  protected static styles = [styleVariables, colorCSS, style];

  protected render(): void {
    if (this.thickness) {
      this.style.setProperty('--thickness', this.thickness);
    } else {
      this.style.removeProperty('--thickness');
    }
  }
}

Divider.define('divider');

declare global {
  interface HTMLElementTagNameMap {
    'ae-divider': Divider;
  }
}

export default Divider;
export type DividerProps = InferProps<typeof Divider>;
