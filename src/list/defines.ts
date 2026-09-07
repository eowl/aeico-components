export type ListVariant = 'subtle' | 'faint' | 'filled' | 'outlined' | 'text';

export interface ListSelectDetail {
  key: string;
  selected: boolean;
  selectedKeys: string[];
}

export interface ParentListLike extends Element {
  variant?: ListVariant;
  divided?: boolean;
}
