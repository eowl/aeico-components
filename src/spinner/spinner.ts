import AeicoComponent from '../aeico-component';
import type { InferProps } from 'aeico';
import { html, prop } from 'aeico';
import styleVariables from '../styles/variables.css?inline';
import sizeCSS from '../styles/size.css?inline';
import colorCSS from '../styles/color.css?inline';
import style from '../styles/components/spinner.css?inline';
import type { SpinnerColor, SpinnerSize, SpinnerVariant } from './defines';

/**
 * Spinner — animated loading indicator.
 *
 * Supports two visual variants: a rotating ring (`border`, default) and
 * three bouncing dots (`dots`). Size and colour are driven by the shared
 * design-token system.
 *
 * @example
 * ```html
 * <ae-spinner></ae-spinner>
 * <ae-spinner variant="dots" color="primary" size="lg"></ae-spinner>
 * <ae-spinner color="success" speed="0.5s" label="Saving…"></ae-spinner>
 * ```
 */
class Spinner extends AeicoComponent {
  static tagName = 'spinner';

  @prop({ type: String })
  accessor variant: SpinnerVariant = 'border';

  @prop({ type: String })
  accessor size: SpinnerSize = 'md';

  @prop({ type: String })
  accessor color: SpinnerColor = 'default';

  @prop({ type: String })
  accessor label: string = 'Loading…';

  @prop({ type: String })
  accessor speed: string | undefined;

  protected static styles = [styleVariables, sizeCSS, colorCSS, style];

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'status');
  }

  protected render() {
    this.setAttribute('aria-label', this.label);

    if (this.speed) {
      this.style.setProperty('--spinner-speed', this.speed);
    } else {
      this.style.removeProperty('--spinner-speed');
    }

    const isDots = this.variant === 'dots';

    return html(({ span }) => {
      span({ part: 'track', className: 'track', 'aria-hidden': 'true' }, () => {
        if (isDots) {
          span({ className: 'dot' });
          span({ className: 'dot' });
          span({ className: 'dot' });
        }
      });
    });
  }
}

Spinner.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-spinner': Spinner;
  }
}

export default Spinner;
export type SpinnerProps = InferProps<typeof Spinner>;
