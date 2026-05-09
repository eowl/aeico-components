import type { InferProps } from 'aeico';
import { html, prop } from 'aeico';
import AeicoComponent from '../aeico-component';
import styleVariables from '../styles/variables.css?inline';
import colorCSS from '../styles/color.css?inline';
import style from '../styles/components/progress-bar.css?inline';
import type { ProgressBarColor } from './defines';

class ProgressBar extends AeicoComponent {
  protected static styles = [styleVariables, colorCSS, style];

  @prop({ type: Number })
  accessor value: number = 0;

  @prop({ type: String })
  accessor label: string = '';

  @prop({ type: String })
  accessor color: ProgressBarColor = 'primary';

  @prop({ type: Boolean })
  accessor animated: boolean = false;

  protected render() {
    const clamped = Math.min(100, Math.max(0, this.value));

    return html(({ div, span }) => {
      div({ part: 'root', className: 'progress-root' }, () => {
        if (this.label) {
          div({ part: 'label', className: 'progress-label', textContent: this.label });
        }
        div(
          {
            part: 'track',
            className: 'progress-track',
            role: 'progressbar',
            'aria-valuenow': String(clamped),
            'aria-valuemin': '0',
            'aria-valuemax': '100',
            ...(this.label ? { 'aria-label': this.label } : {}),
          },
          () => {
            span({
              part: 'bar',
              className: 'progress-bar',
              style: { width: `${clamped}%` },
            });
          },
        );
      });
    });
  }
}

ProgressBar.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-progress-bar': ProgressBar;
  }
}

export default ProgressBar;
export type ProgressBarProps = InferProps<typeof ProgressBar>;
