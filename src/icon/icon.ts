import type { InferProps, Props } from 'aeico';
import { SVG_NS } from '../utils';
import AeicoComponent from '../aeico-component';
import { html } from 'aeico';
import styleVariables from '../styles/variables.css?inline';
import sizeCSS from '../styles/size.css?inline';
import colorCSS from '../styles/color.css?inline';
import style from '../styles/components/icon.css?inline';
import type { IconSize, IconColor } from './defines';
import { defaultViewBox } from './defines';
import IconRegistry from './registry';

class Icon extends AeicoComponent {
  static tagName = 'icon';

  static props: Props = {
    name: { type: String },
    size: { type: String },
    color: { type: String },
    stroke: { type: Boolean },
    strokeWidth: { type: Number },
  };

  declare name?: string;
  declare size?: IconSize;
  declare color?: IconColor;
  declare stroke?: boolean;
  declare strokeWidth?: number;

  protected static styles = [styleVariables, sizeCSS, colorCSS, style];

  protected render() {
    const def = this.name ? IconRegistry.get(this.name) : undefined;

    // Numeric size: set font-size directly (string sizes are handled by size.css)
    const numericSize = Number(this.size);
    if (this.size !== undefined && !isNaN(numericSize) && numericSize > 0) {
      this.style.setProperty('font-size', `${numericSize}px`);
    } else {
      this.style.removeProperty('font-size');
    }

    // Resolve stroke: component prop takes priority over registry definition
    const useStroke = this.stroke ?? def?.stroke ?? false;
    const useStrokeWidth = this.strokeWidth ?? def?.strokeWidth ?? 2;

    if (useStroke) {
      this.style.setProperty('--icon-fill', 'none');
      this.style.setProperty('--icon-stroke', 'currentColor');
      this.style.setProperty('--icon-stroke-width', String(useStrokeWidth));
    } else {
      this.style.removeProperty('--icon-fill');
      this.style.removeProperty('--icon-stroke');
      this.style.removeProperty('--icon-stroke-width');
    }

    if (!def) return;

    return html(({ svg, path }) => {
      svg(
        {
          className: 'icon-svg',
          viewBox: def.viewBox ?? defaultViewBox,
          'aria-hidden': 'true',
          xmlns: SVG_NS,
        },
        () => {
          path({ d: def.path });
        },
      );
    });
  }
}

Icon.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-icon': Icon;
  }
}

export default Icon;
export type IconProps = InferProps<typeof Icon>;
