export type MenuMode = 'flyout' | 'inline';
export type MenuOrientation = 'horizontal' | 'vertical';
export type MenuTrigger = 'click' | 'hover';
export type MenuIconPlacement = 'start' | 'end';

export interface ParentMenuLike extends Element {
  mode?: MenuMode;
  orientation?: MenuOrientation;
  trigger?: MenuTrigger;
  wrapText?: boolean;
  expandIcon?: string;
  collapseIcon?: string;
  iconPlacement?: MenuIconPlacement;
}

export interface MenuSelectDetail {
  key: string;
  label: string;
  keyPath: string[];
}
