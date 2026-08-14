export type TreeIconPlacement = 'start' | 'end';

export interface ParentTreeLike extends Element {
  checkable?: boolean;
  multiple?: boolean;
  showLine?: boolean;
  defaultExpandAll?: boolean;
  wrapText?: boolean;
  expandIcon?: string;
  collapseIcon?: string;
  iconPlacement?: TreeIconPlacement;
}

export interface TreeSelectDetail {
  key: string;
  selected: boolean;
  selectedKeys: string[];
}

export interface TreeExpandDetail {
  key: string;
  expanded: boolean;
  expandedKeys: string[];
}

export interface TreeCheckDetail {
  key: string;
  checked: boolean;
  checkedKeys: string[];
}
