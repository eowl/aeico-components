/** Minimal interface used by tree-item to read config from its parent ae-tree. */
export interface ParentTreeLike extends Element {
  checkable?: boolean;
  multiple?: boolean;
  showLine?: boolean;
  defaultExpandAll?: boolean;
  icon?: string;
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
