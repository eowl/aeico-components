export type MenuMode = 'flyout' | 'inline';
export type MenuOrientation = 'horizontal' | 'vertical';
export type MenuTrigger = 'click' | 'hover';
export type MenuIconPlacement = 'start' | 'end';

/** Minimal interface used by menu-item to read config from its parent ae-menu. */
export interface ParentMenuLike extends Element {
  mode?: MenuMode;
  orientation?: MenuOrientation;
  trigger?: MenuTrigger;
}

export interface MenuSelectDetail {
  key: string;
  label: string;
  keyPath: string[];
}
