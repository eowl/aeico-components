import AeicoComponent from '../aeico-component';
import type { InferProps } from 'aeico';
import { html, prop } from 'aeico';
import style from '../styles/components/tree-item.css';
import variables from '../styles/variables.css';
import type { ParentTreeLike } from './defines';
import { SVG_NS } from '../utils';
import '../icon';

let _autoKeyCounter = 0;

/**
 * Tree item - used as a direct child of `<ae-tree>` or nested inside another
 * `<ae-tree-item>` to create a multi-level tree.
 *
 * - **Parent item**: nest `<ae-tree-item>` children inside; an expand toggle is shown.
 * - **Leaf item**: no `<ae-tree-item>` children; no expand toggle is shown.
 *
 * @prop {string}  key          - Unique identifier for this item.
 * @prop {boolean} disabled     - Disables interaction.
 * @prop {boolean} expanded     - Whether children are visible.
 * @prop {boolean} selected     - Whether this item is visually selected.
 * @prop {boolean} checked      - Checkbox state (checkable mode).
 * @prop {boolean} indeterminate - Checkbox partial state (checkable mode, JS-only).
 *
 * @slot default - Child `<ae-tree-item>` elements.
 * @slot label   - Custom label content (falls back to the `label` attribute text).
 */
class TreeItem extends AeicoComponent {
  protected static styles = [variables, style];

  @prop({ type: String })
  accessor key: string | undefined;

  /** Stable auto-generated key used when `key` prop is not set. */
  private readonly _autoKey = `ae-tree-item-${_autoKeyCounter++}`;

  private get _effectiveKey(): string {
    return this.key ?? this._autoKey;
  }

  @prop({ type: Boolean })
  accessor disabled: boolean = false;

  @prop({ type: Boolean })
  accessor expanded: boolean = false;

  @prop({ type: Boolean })
  accessor selected: boolean = false;

  @prop({ type: Boolean })
  accessor checked: boolean = false;

  @prop({ type: Boolean })
  accessor indeterminate: boolean = false;

  private _checkboxEl: HTMLInputElement | null = null;

  connectedCallback() {
    super.connectedCallback();

    // Auto-assign slot so users don't need to write slot="sub" manually
    if (
      this.parentElement?.tagName.toLowerCase() === 'ae-tree-item' &&
      !this.hasAttribute('slot')
    ) {
      this.setAttribute('slot', 'sub');
    }

    let depth = 0;
    let el: Element | null = this.parentElement;
    while (el) {
      const tag = el.tagName.toLowerCase();
      if (tag === 'ae-tree-item') {
        depth++;
      } else if (tag === 'ae-tree') {
        break;
      }
      el = el.parentElement;
    }
    this.style.setProperty('--depth', String(depth));

    if (this._parentTree?.showLine) {
      this.setAttribute('showline', '');
    }
  }

  protected onMounted(): void {
    if (this._parentTree?.defaultExpandAll && this._hasChildren) {
      this.expanded = true;
    }
  }

  private get _parentTree(): ParentTreeLike | null {
    return this.closest<ParentTreeLike>('ae-tree');
  }

  private get _isCheckable(): boolean {
    return this._parentTree?.checkable ?? false;
  }

  private get _wrapText(): boolean {
    return this._parentTree?.wrapText ?? false;
  }

  private get _hasChildren(): boolean {
    return !!this.querySelector(':scope > ae-tree-item[slot="sub"]');
  }

  private _handleExpandClick = (e: Event): void => {
    e.stopPropagation();
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent('_tree-item-toggle-expand', {
        bubbles: true,
        composed: true,
        detail: { key: this._effectiveKey },
      }),
    );
  };

  private _handleLabelClick = (): void => {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent('_tree-item-select', {
        bubbles: true,
        composed: true,
        detail: { key: this._effectiveKey },
      }),
    );
  };

  private _handleCheckChange = (e: Event): void => {
    if (this.disabled) return;
    const input = e.target as HTMLInputElement;
    this.dispatchEvent(
      new CustomEvent('_tree-item-check', {
        bubbles: true,
        composed: true,
        detail: { key: this._effectiveKey, checked: input.checked },
      }),
    );
  };

  private _handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if ((e.target as HTMLElement).classList.contains('tree-item-label')) {
        this._handleLabelClick();
      }
    }
    if (e.key === 'ArrowRight' && this._hasChildren && !this.expanded) {
      this._handleExpandClick(e);
    }
    if (e.key === 'ArrowLeft' && this.expanded) {
      this._handleExpandClick(e);
    }
  };

  protected onUpdated(): void {
    // indeterminate/checked cannot be set correctly via HTML attribute - must set via JS property
    if (this._checkboxEl) {
      this._checkboxEl.checked = this.checked;
      this._checkboxEl.indeterminate = this.indeterminate;
    }
  }

  protected render() {
    const hasChildren = this._hasChildren;
    const isCheckable = this._isCheckable;
    // Collapsed shows expandIcon; expanded shows collapseIcon (falls back to
    // expandIcon, which is rotated by CSS). No icon set -> default SVG triangle.
    const expandIcon = this._parentTree?.expandIcon;
    const collapseIcon = this._parentTree?.collapseIcon ?? expandIcon;
    // When a distinct collapseIcon is provided, the icon swaps on expand
    // instead of being rotated.
    const swapIcon = !!this._parentTree?.collapseIcon;

    return html(({ div, button, span, input, slot, svg, path, aeIcon }) => {
      div(
        {
          className: {
            'tree-item-content': true,
            'tree-item-content--wrap': this._wrapText,
          },
          role: 'treeitem',
          'aria-expanded': hasChildren ? String(this.expanded) : undefined,
          'aria-selected': String(this.selected),
          'aria-disabled': this.disabled ? 'true' : undefined,
        },
        () => {
          if (hasChildren) {
            button(
              {
                type: 'button',
                className: {
                  'expand-btn': true,
                  'expand-btn--swap': swapIcon,
                },
                tabIndex: -1,
                'aria-hidden': 'true',
                '@click': this._handleExpandClick,
              },
              () => {
                const iconName = this.expanded ? collapseIcon : expandIcon;
                if (iconName) {
                  aeIcon({ className: 'expand-icon', name: iconName });
                } else {
                  svg(
                    {
                      className: 'expand-icon',
                      viewBox: '0 0 10 10',
                      'aria-hidden': 'true',
                      xmlns: SVG_NS,
                    },
                    () => {
                      path({ d: 'M2 1l6 4-6 4V1z' });
                    },
                  );
                }
              },
            );
          } else {
            span({ className: 'expand-placeholder', 'aria-hidden': 'true' });
          }

          if (isCheckable) {
            this._checkboxEl = input({
              type: 'checkbox',
              className: 'tree-item-checkbox',
              checked: this.checked,
              disabled: this.disabled,
              tabIndex: -1,
              '@change': this._handleCheckChange,
            });
          }

          button(
            {
              type: 'button',
              className: {
                'tree-item-label': true,
                'tree-item-label--wrap': this._wrapText,
              },
              disabled: this.disabled,
              '@click': this._handleLabelClick,
              '@keydown': this._handleKeydown,
            },
            () => {
              slot();
            },
          );
        },
      );

      div({ className: 'tree-item-children', role: 'group' }, () => {
        slot({ name: 'sub' });
      });
    });
  }
}

TreeItem.define('tree-item');

declare global {
  interface HTMLElementTagNameMap {
    'ae-tree-item': TreeItem;
  }
}

export default TreeItem;
export type TreeItemProps = InferProps<typeof TreeItem>;
