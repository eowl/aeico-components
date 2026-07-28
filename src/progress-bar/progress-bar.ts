import type { InferProps } from 'aeico';
import { html, prop } from 'aeico';
import AeicoComponent from '../aeico-component';
import styleVariables from '../styles/variables.css';
import colorCSS from '../styles/color.css';
import style from '../styles/components/progress-bar.css';
import type { ProgressBarColor } from './defines';

/**
 * Progress bars show how far along an ongoing operation is as a horizontal fill.
 * Use them for file uploads, multi-step flows, or any task with measurable progress.
 *
 * @prop {number} value - Completion percentage, automatically clamped to 0–100.
 * @prop {string} label - Accessible label applied as `aria-label` on the track.
 * @prop {'default'|'primary'|'secondary'|'success'|'danger'|'warning'|'info'} color
 *   - Preset color variant driven by the shared color system.
 * @prop {boolean} animated - When set, overlays a shimmer sweep animation on the bar.
 *
 * @csspart base - The outermost wrapper `<div>`.
 * @csspart track - The background track `<div>`.
 * @csspart bar - The filled progress `<span>`.
 *
 * @cssproperty [--progress-height=8px] - Height of both the track and the bar.
 * @cssproperty [--progress-bar-color=var(--color-solid)] - Fill color of the bar.
 *   When set, takes precedence over the `color` prop entirely.
 */
class ProgressBar extends AeicoComponent {
  static tagName = 'progress-bar';
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
      div({ part: 'base' }, () => {
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
