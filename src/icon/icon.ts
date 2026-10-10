import type { InferProps, Props } from 'aeico';
import { SVG_NS } from '../utils';
import AeicoComponent from '../aeico-component';
import { html } from 'aeico';
import styleVariables from '../styles/variables.css';
import sizeCSS from '../styles/size.css';
import colorCSS from '../styles/color.css';
import style from '../styles/components/icon.css';
import type { IconSize, IconColor, IconGradientDef } from './defines';
import { defaultViewBox } from './defines';
import IconRegistry from './registry';
import './internal-icons';

class Icon extends AeicoComponent {
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

  private static parseRawSvg(rawSvg: string): { inner: string; viewBox?: string } {
    const doc = new DOMParser().parseFromString(rawSvg, 'image/svg+xml');
    const el = doc.documentElement;
    if (!el || el.nodeName.toLowerCase() !== 'svg' || el.querySelector('parsererror')) {
      return { inner: '' };
    }

    return { inner: el.innerHTML, viewBox: el.getAttribute('viewBox') ?? undefined };
  }

  protected render() {
    const def = this.name ? IconRegistry.get(this.name) : undefined;

    const numericSize = Number(this.size);
    if (this.size !== undefined && !isNaN(numericSize) && numericSize > 0) {
      this.style.setProperty('font-size', `${numericSize}px`);
    } else {
      this.style.removeProperty('font-size');
    }

    if (!def) return;

    if ('rawSvg' in def) {
      const raw = Icon.parseRawSvg(def.rawSvg);
      const viewBox = def.viewBox ?? raw.viewBox ?? defaultViewBox;

      return html((t) => {
        t.svg({
          className: 'icon-svg',
          viewBox,
          'aria-hidden': 'true',
          xmlns: SVG_NS,
          innerHTML: raw.inner,
        });
      });
    }

    const viewBox = def.viewBox ?? defaultViewBox;
    const { paths } = def;
    const isMultiPath = Array.isArray(paths);

    if (!isMultiPath) {
      const useStroke =
        this.stroke ?? (this.strokeWidth !== undefined ? true : (def.stroke ?? false));
      const useStrokeWidth = this.strokeWidth ?? def.strokeWidth ?? 2;

      if (useStroke) {
        this.style.setProperty('--icon-fill', 'none');
        this.style.setProperty('--icon-stroke', 'currentColor');
        this.style.setProperty('--icon-stroke-width', String(useStrokeWidth));
      } else {
        this.style.removeProperty('--icon-fill');
        this.style.removeProperty('--icon-stroke');
        this.style.removeProperty('--icon-stroke-width');
      }
    } else {
      this.style.removeProperty('--icon-fill');
      this.style.removeProperty('--icon-stroke');
      this.style.removeProperty('--icon-stroke-width');
    }

    return html((t) => {
      t.svg(
        {
          className: 'icon-svg',
          viewBox,
          'aria-hidden': 'true',
          xmlns: SVG_NS,
        },
        () => {
          if (def.defs?.length) {
            t.defs(undefined, () => {
              def.defs!.forEach((g, i) => Icon.renderGradientDef(t, g, i));
            });
          }
          if (typeof paths === 'string') {
            t.path({ d: paths });
          } else {
            for (const p of paths) {
              const attrs: Record<string, unknown> = { d: p.d };
              const useStroke = p.stroke ?? def.stroke ?? false;
              const strokeWidth = p.strokeWidth ?? def.strokeWidth;
              if (p.fill) {
                attrs.fill = p.fill;
              } else if (useStroke) {
                attrs.fill = 'none';
              }
              if (useStroke) {
                attrs.stroke = 'currentColor';
                attrs['stroke-width'] = strokeWidth ?? 2;
              } else if (strokeWidth !== undefined) {
                attrs['stroke-width'] = strokeWidth;
              }
              t.path(attrs);
            }
          }
        },
      );
    });
  }

  private static renderGradientDef(
    t: Parameters<Parameters<typeof html>[0]>[0],
    def: IconGradientDef,
    index: number,
  ) {
    const id = def.id ?? `ae-icon-grad-${index}`;
    const common = {
      id,
      gradientUnits: def.gradientUnits,
      gradientTransform: def.gradientTransform,
    };
    const renderStops = () => {
      for (const s of def.stops) {
        t.stop({
          offset: s.offset,
          'stop-color': s.stopColor,
          'stop-opacity': s.stopOpacity,
        });
      }
    };
    if (def.type === 'linear') {
      t.el(
        'linearGradient',
        {
          ...common,
          x1: def.x1 ?? 0,
          y1: def.y1 ?? 0,
          x2: def.x2 ?? 1,
          y2: def.y2 ?? 0,
        },
        renderStops,
      );
    } else {
      t.el(
        'radialGradient',
        {
          ...common,
          cx: def.cx ?? 0.5,
          cy: def.cy ?? 0.5,
          r: def.r ?? 0.5,
          fx: def.fx,
          fy: def.fy,
        },
        renderStops,
      );
    }
  }
}

Icon.define('icon');

declare global {
  interface HTMLElementTagNameMap {
    'ae-icon': Icon;
  }
}

export default Icon;
export type IconProps = InferProps<typeof Icon>;
