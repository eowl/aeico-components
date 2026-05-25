import { html, prop, tags } from 'aeico';
import type { InferProps } from 'aeico';
import AeicoComponent from '../aeico-component';
import styleVariables from '../styles/variables.css?inline';
import sizeCSS from '../styles/size.css?inline';
import paginationStyle from '../styles/components/pagination.css?inline';
import type { PaginationSize } from './defines';
import '../icon/icon';

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

/**
 * Pagination component for navigating between pages of content.
 *
 * @prop {number} page - Current page number (1-indexed). Default: 1.
 * @prop {number} pageSize - Number of items per page. Default: 10.
 * @prop {number} total - Total number of items. Used to compute pageCount when pageCount is not set.
 * @prop {number} pageCount - Total number of pages. Overrides total/pageSize calculation when set.
 * @prop {number} siblingCount - Number of page buttons to show on each side of the current page. Default: 1.
 * @prop {'xs'|'sm'|'md'|'lg'} size - Size variant.
 * @prop {boolean} disabled - Disables all interactive controls.
 * @prop {boolean} simple - Simple mode: shows only prev/next buttons and a page number input.
 * @prop {boolean} showFirstLast - Show dedicated first-page and last-page jump buttons.
 * @prop {boolean} borderless - Removes the border from all buttons and the page input.
 *
 * @event {CustomEvent<{page: number}>} change - Fired when the page changes.
 *
 * @slot prev - Custom content for the previous-page button (default: chevron-left icon).
 * @slot next - Custom content for the next-page button (default: chevron-right icon).
 * @slot first - Custom content for the first-page button (default: chevrons-left icon). Requires showFirstLast.
 * @slot last - Custom content for the last-page button (default: chevrons-right icon). Requires showFirstLast.
 *
 * @csspart root - The outer <nav> element.
 * @csspart prev - The previous-page button.
 * @csspart next - The next-page button.
 * @csspart first - The first-page button (visible when showFirstLast).
 * @csspart last - The last-page button (visible when showFirstLast).
 * @csspart item - A page number button.
 * @csspart ellipsis - An ellipsis span between page groups.
 * @csspart page-input - The page number input in simple mode.
 * @csspart page-total - The "/ N" label in simple mode.
 *
 * @example
 * ```html
 * <ae-pagination total="100" page-size="10" page="1"></ae-pagination>
 * ```
 */
class Pagination extends AeicoComponent {
  static tagName = 'pagination';

  protected static styles = [styleVariables, sizeCSS, paginationStyle];

  @prop({ type: Number })
  accessor page: number = 1;

  @prop({ type: Number })
  accessor pageSize: number = 10;

  @prop({ type: Number })
  accessor total: number = 0;

  @prop({ type: Number })
  accessor pageCount: number | undefined;

  @prop({ type: Number })
  accessor siblingCount: number = 1;

  @prop({ type: String })
  accessor size: PaginationSize | undefined;

  @prop({ type: Boolean })
  accessor disabled: boolean = false;

  @prop({ type: Boolean })
  accessor simple: boolean = false;

  @prop({ type: Boolean })
  accessor showFirstLast: boolean = false;

  @prop({ type: Boolean })
  accessor borderless: boolean = false;

  private _simpleInput: HTMLInputElement | null = null;

  private get _computedPageCount(): number {
    if (this.pageCount != null) return Math.max(1, this.pageCount);
    const ps = this.pageSize > 0 ? this.pageSize : 10;
    return Math.max(1, Math.ceil(this.total / ps));
  }

  private get _currentPage(): number {
    const count = this._computedPageCount;
    return Math.max(1, Math.min(this.page ?? 1, count));
  }

  private _getPageItems(): PageItem[] {
    const count = this._computedPageCount;
    const page = this._currentPage;
    const sc = Math.max(0, this.siblingCount ?? 1);

    const rangeStart = Math.max(2, page - sc);
    const rangeEnd = Math.min(count - 1, page + sc);

    const showLeftEllipsis = rangeStart > 2;
    const showRightEllipsis = rangeEnd < count - 1;

    const items: PageItem[] = [];

    // First page always shown
    items.push(1);

    if (count <= 1) return items;

    // Left side
    if (showLeftEllipsis) {
      items.push('ellipsis-start');
    } else {
      for (let i = 2; i < rangeStart; i++) items.push(i);
    }

    // Sibling range (bounded to 2..count-1)
    for (let i = rangeStart; i <= rangeEnd; i++) items.push(i);

    // Right side
    if (showRightEllipsis) {
      items.push('ellipsis-end');
    } else {
      for (let i = rangeEnd + 1; i < count; i++) items.push(i);
    }

    // Last page always shown
    items.push(count);

    return items;
  }

  private _goToPage(page: number): void {
    const count = this._computedPageCount;
    const next = Math.max(1, Math.min(count, page));
    if (next === this._currentPage) return;
    this.page = next;
    this.emit('change', { detail: { page: this.page } });
  }

  private _handleItemClick = (e: Event): void => {
    const btn = e.currentTarget as HTMLElement;
    const p = Number(btn.dataset.page);
    if (!isNaN(p)) this._goToPage(p);
  };

  private _handlePrevClick = (): void => {
    this._goToPage(this._currentPage - 1);
  };
  private _handleNextClick = (): void => {
    this._goToPage(this._currentPage + 1);
  };
  private _handleFirstClick = (): void => {
    this._goToPage(1);
  };
  private _handleLastClick = (): void => {
    this._goToPage(this._computedPageCount);
  };

  private _handleSimpleInputChange = (e: Event): void => {
    const input = e.target as HTMLInputElement;
    const val = parseInt(input.value, 10);
    if (!isNaN(val)) {
      this._goToPage(val);
    }
    // Sync input to actual current page (handles out-of-range values)
    input.value = String(this._currentPage);
  };

  protected onUpdated(): void {
    // Keep the simple-mode input in sync with the page prop
    if (this._simpleInput) {
      this._simpleInput.value = String(this._currentPage);
    }
  }

  protected render() {
    const count = this._computedPageCount;
    const page = this._currentPage;
    const disabled = this.disabled;
    const isFirst = page <= 1;
    const isLast = page >= count;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const icon = tags as any;

    return html(({ nav, button, span, slot, input }) => {
      nav({ part: 'root', role: 'navigation', 'aria-label': 'Pagination' }, () => {
        // First page button
        if (this.showFirstLast) {
          button(
            {
              key: 'first',
              part: 'first',
              className: 'nav-btn',
              disabled: disabled || isFirst,
              'aria-label': 'First page',
              '@click': this._handleFirstClick,
            },
            () => {
              slot({ name: 'first' }, () => {
                icon['ae-icon']({ name: 'chevrons-left' });
              });
            },
          );
        }

        // Prev button
        button(
          {
            key: 'prev',
            part: 'prev',
            className: 'nav-btn',
            disabled: disabled || isFirst,
            'aria-label': 'Previous page',
            '@click': this._handlePrevClick,
          },
          () => {
            slot({ name: 'prev' }, () => {
              icon['ae-icon']({ name: 'chevron-left' });
            });
          },
        );

        if (this.simple) {
          // Simple mode: input + "/ N" label
          this._simpleInput = input({
            key: 'page-input',
            part: 'page-input',
            type: 'number',
            min: '1',
            max: String(count),
            value: String(page),
            disabled,
            'aria-label': 'Page number',
            '@change': this._handleSimpleInputChange,
          });
          span({
            key: 'page-total',
            part: 'page-total',
            textContent: `/ ${count}`,
          });
        } else {
          // Full mode: page number buttons with optional ellipsis
          const items = this._getPageItems();
          for (const item of items) {
            if (item === 'ellipsis-start' || item === 'ellipsis-end') {
              tags.span({
                key: item,
                part: 'ellipsis',
                className: 'ellipsis',
                'aria-hidden': 'true',
                textContent: '…',
              });
            } else {
              const isActive = item === page;
              tags.button({
                key: `item-${item}`,
                part: isActive ? 'item item-active' : 'item',
                className: isActive ? 'item active' : 'item',
                disabled,
                'aria-current': isActive ? 'page' : undefined,
                'aria-label': `Page ${item}`,
                'data-page': String(item),
                textContent: String(item),
                '@click': this._handleItemClick,
              });
            }
          }
        }

        // Next button
        button(
          {
            key: 'next',
            part: 'next',
            className: 'nav-btn',
            disabled: disabled || isLast,
            'aria-label': 'Next page',
            '@click': this._handleNextClick,
          },
          () => {
            slot({ name: 'next' }, () => {
              icon['ae-icon']({ name: 'chevron-right' });
            });
          },
        );

        // Last page button
        if (this.showFirstLast) {
          button(
            {
              key: 'last',
              part: 'last',
              className: 'nav-btn',
              disabled: disabled || isLast,
              'aria-label': 'Last page',
              '@click': this._handleLastClick,
            },
            () => {
              slot({ name: 'last' }, () => {
                icon['ae-icon']({ name: 'chevrons-right' });
              });
            },
          );
        }
      });
    });
  }
}

Pagination.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-pagination': Pagination;
  }
}

export default Pagination;
export type PaginationProps = InferProps<typeof Pagination>;
