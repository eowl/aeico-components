export type MenuMode = 'flyout' | 'inline';
export type MenuOrientation = 'horizontal' | 'vertical';
export type MenuTrigger = 'click' | 'hover';

export interface MenuSelectDetail {
  key: string;
  label: string;
  keyPath: string[];
}
