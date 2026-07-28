import AeicoComponent from '../aeico-component';
import type { InferProps } from 'aeico';
import { html, prop } from 'aeico';
import style from '../styles/components/tree.css';
import variables from '../styles/variables.css';
import type { TreeSelectDetail, TreeExpandDetail, TreeCheckDetail } from './defines';
import './tree-item';
import type TreeItem from './tree-item';

/**
 * Tree component. Renders a hierarchical tree of `<ae-tree-item>` elements.
 *
 * @prop {boolean} checkable       - Enable checkbox selection mode with parent-child sync.
 * @prop {boolean} multiple        - Allow multi-select (click to toggle). Ignored when checkable.
 * @prop {boolean} showLine        - Show dashed connecting lines between items.
 * @prop {boolean} defaultExpandAll - Expand all items on initial connect.
 * @prop {string}  selectedKey     - Currently selected key (single-select convenience prop).
 *
 * @property {string[]} selectedKeys - Currently selected keys (multi-select).
 * @property {string[]} checkedKeys  - Currently checked keys (checkable mode).
 * @property {string[]} expandedKeys - Currently expanded keys.
 *
 * @event {CustomEvent<TreeSelectDetail>} select - Fires when an item is selected/deselected.
 * @event {CustomEvent<TreeExpandDetail>} expand - Fires when an item is expanded/collapsed.
 * @event {CustomEvent<TreeCheckDetail>}  check  - Fires when an item checkbox changes.
 *
 * @example
 * ```html
 * <ae-tree>
 *   <ae-tree-item key="1" label="Parent">
 *     <ae-tree-item key="1-1" label="Child A"></ae-tree-item>
 *     <ae-tree-item key="1-2" label="Child B"></ae-tree-item>
 *   </ae-tree-item>
 * </ae-tree>
 * ```
 */
class Tree extends AeicoComponent {
  static tagName = 'tree';

  protected static styles = [variables, style];

  @prop({ type: Boolean })
  accessor checkable: boolean = false;

  @prop({ type: Boolean })
  accessor multiple: boolean = false;

  @prop({ type: Boolean })
  accessor showLine: boolean = false;

  @prop({ type: Boolean })
  accessor defaultExpandAll: boolean = false;

  @prop({ type: String })
  accessor selectedKey: string | undefined;

  /** Icon name used for the expand/collapse toggle on all items (overridable per item). */
  @prop({ type: String })
  accessor icon: string | undefined;

  /** Currently selected keys (multi-select). Set programmatically. */
  selectedKeys: string[] = [];

  /** Currently checked keys (checkable mode). Set programmatically. */
  checkedKeys: string[] = [];

  /** Currently expanded keys. Set programmatically. */
  expandedKeys: string[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.listen('_tree-item-toggle-expand', this._handleItemToggleExpand as EventListener);
    this.listen('_tree-item-select', this._handleItemSelect as EventListener);
    this.listen('_tree-item-check', this._handleItemCheck as EventListener);
  }

  private _getAllItems(): TreeItem[] {
    return Array.from(this.querySelectorAll<TreeItem>('ae-tree-item'));
  }

  private _getDirectChildren(node: Element): TreeItem[] {
    return Array.from(node.querySelectorAll<TreeItem>(':scope > ae-tree-item'));
  }

  private _computeCheckedKeys(): string[] {
    const keys: string[] = [];
    for (const item of this._getAllItems()) {
      if (item.checked && !item.indeterminate) {
        keys.push(item.key ?? '');
      }
    }
    return keys.filter(Boolean);
  }

  private _handleItemToggleExpand = (e: CustomEvent<{ key: string }>): void => {
    const node = e.target as TreeItem;
    const newExpanded = !node.expanded;
    node.expanded = newExpanded;

    const key = node.key ?? '';
    if (newExpanded) {
      if (!this.expandedKeys.includes(key)) {
        this.expandedKeys = [...this.expandedKeys, key];
      }
    } else {
      this.expandedKeys = this.expandedKeys.filter((k) => k !== key);
    }

    this.emit('expand', {
      detail: {
        key,
        expanded: newExpanded,
        expandedKeys: [...this.expandedKeys],
      } satisfies TreeExpandDetail,
    });
  };

  private _handleItemSelect = (e: CustomEvent<{ key: string }>): void => {
    const { key } = e.detail;

    if (this.multiple) {
      // Toggle selection
      const alreadySelected = this.selectedKeys.includes(key);
      if (alreadySelected) {
        this.selectedKeys = this.selectedKeys.filter((k) => k !== key);
      } else {
        this.selectedKeys = [...this.selectedKeys, key];
      }
      this.selectedKey = this.selectedKeys[this.selectedKeys.length - 1];

      // Sync visual state
      this._getAllItems().forEach((item) => {
        item.selected = this.selectedKeys.includes(item.key ?? '');
      });

      this.emit('select', {
        detail: {
          key,
          selected: !alreadySelected,
          selectedKeys: [...this.selectedKeys],
        } satisfies TreeSelectDetail,
      });
    } else {
      // Single select — deselect all, select target
      const alreadySelected = this.selectedKey === key;
      this._getAllItems().forEach((item) => {
        item.selected = !alreadySelected && item.key === key;
      });
      this.selectedKey = alreadySelected ? undefined : key;
      this.selectedKeys = this.selectedKey ? [this.selectedKey] : [];

      this.emit('select', {
        detail: {
          key,
          selected: !alreadySelected,
          selectedKeys: [...this.selectedKeys],
        } satisfies TreeSelectDetail,
      });
    }
  };

  private _handleItemCheck = (e: CustomEvent<{ key: string; checked: boolean }>): void => {
    const { key, checked } = e.detail;
    const sourceNode = e.target as TreeItem;

    this._setCheckedRecursive(sourceNode, checked);
    this._syncAncestors(sourceNode);
    this.checkedKeys = this._computeCheckedKeys();

    this.emit('check', {
      detail: { key, checked, checkedKeys: [...this.checkedKeys] } satisfies TreeCheckDetail,
    });
  };

  private _setCheckedRecursive(node: TreeItem, checked: boolean): void {
    if (node.disabled) return;
    node.checked = checked;
    node.indeterminate = false;
    for (const child of this._getDirectChildren(node)) {
      this._setCheckedRecursive(child, checked);
    }
  }

  private _syncAncestors(sourceNode: TreeItem): void {
    let el: Element | null = sourceNode.parentElement;
    while (el) {
      const tag = el.tagName.toLowerCase();
      if (tag === 'ae-tree-item') {
        const parent = el as TreeItem;
        const children = this._getDirectChildren(parent).filter((c) => !c.disabled);
        if (children.length === 0) break;
        const checkedCount = children.filter((c) => c.checked && !c.indeterminate).length;
        const indeterminateCount = children.filter((c) => c.indeterminate).length;

        if (checkedCount === children.length) {
          parent.checked = true;
          parent.indeterminate = false;
        } else if (checkedCount > 0 || indeterminateCount > 0) {
          parent.checked = false;
          parent.indeterminate = true;
        } else {
          parent.checked = false;
          parent.indeterminate = false;
        }
      } else if (tag === 'ae-tree') {
        break;
      }
      el = el.parentElement;
    }
  }

  protected render() {
    return html(({ div, slot }) => {
      div(
        {
          className: 'tree',
          role: 'tree',
          'aria-multiselectable': this.multiple ? 'true' : 'false',
        },
        () => {
          slot();
        },
      );
    });
  }
}

Tree.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-tree': Tree;
  }
}

export default Tree;
export type TreeProps = InferProps<typeof Tree>;
