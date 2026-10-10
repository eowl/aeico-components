export type IconSize = '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export type IconColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info';

export interface IconPathDef {
  d: string;
  fill?: string;
  stroke?: boolean;
  strokeWidth?: number;
}

export interface IconStop {
  offset?: string | number;
  stopColor: string;
  stopOpacity?: number;
}

export interface IconGradientDef {
  type: 'linear' | 'radial';
  id?: string;
  stops: IconStop[];
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  cx?: number;
  cy?: number;
  r?: number;
  fx?: number;
  fy?: number;
  gradientUnits?: 'objectBoundingBox' | 'userSpaceOnUse';
  gradientTransform?: string;
}

export interface IconPathDefinition {
  paths: string | IconPathDef[];
  viewBox?: string;
  stroke?: boolean;
  strokeWidth?: number;
  defs?: IconGradientDef[];
}

export interface IconRawSvgDefinition {
  rawSvg: string;
  viewBox?: string;
}

export type IconDefinition = IconPathDefinition | IconRawSvgDefinition;

export type IconRawSvg = IconRawSvgDefinition;

export const defaultViewBox = '0 0 24 24';

export type IconRegistryInput = Record<string, string | IconDefinition | IconRawSvg>;
