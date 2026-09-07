export type ListVariant = 'plain' | 'bordered';

export interface ListSelectDetail {
  key: string;
  selected: boolean;
  selectedKeys: string[];
}

export interface ParentListLike extends Element {
  variant?: ListVariant;
  divided?: boolean;
}
