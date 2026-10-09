import { html, prop, tags } from 'aeico';
import type { InferProps } from 'aeico';
import AeicoComponent from '../aeico-component';
import styleVariables from '../styles/variables.css';
import sizeCSS from '../styles/size.css';
import paginationStyle from '../styles/components/pagination.css';
import type { PaginationSize, PaginationVariant } from './defines';
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
 * @prop {'borderless'|'link'} variant - Visual variant. `borderless` removes borders; `link` renders page numbers as plain text links with no borders or backgrounds.
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

  @prop({ type: String })
  accessor variant: PaginationVariant | undefined;

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

    input.value = String(this._currentPage);
  };

  protected onUpdated(): void {
    if (this._simpleInput) {
      this._simpleInput.value = String(this._currentPage);
    }
  }

  private _renderNavBtn(
    name: 'first' | 'prev' | 'next' | 'last',
    iconName: string,
    label: string,
    disabled: boolean,
    onClick: () => void,
  ): void {
    const { button, slot, aeIcon } = tags;

    button(
      {
        key: name,
        part: name,
        className: 'nav-btn',
        disabled,
        'aria-label': label,
        '@click': onClick,
      },
      () => {
        slot({ name }, () => {
          aeIcon({ name: iconName });
        });
      },
    );
  }

  private _renderSimpleMode(page: number, count: number, disabled: boolean): void {
    this._simpleInput = tags.input({
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
    tags.span({ key: 'page-total', part: 'page-total', textContent: `/ ${count}` });
  }

  private _renderPageItems(page: number, disabled: boolean): void {
    for (const item of this._getPageItems()) {
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

  protected render() {
    const count = this._computedPageCount;
    const page = this._currentPage;
    const disabled = this.disabled;
    const isFirst = page <= 1;
    const isLast = page >= count;

    return html(({ nav }) => {
      nav({ part: 'root', role: 'navigation', 'aria-label': 'Pagination' }, () => {
        if (this.showFirstLast)
          this._renderNavBtn(
            'first',
            '_chevrons-left',
            'First page',
            disabled || isFirst,
            this._handleFirstClick,
          );

        this._renderNavBtn(
          'prev',
          '_chevron-left',
          'Previous page',
          disabled || isFirst,
          this._handlePrevClick,
        );

        if (this.simple) {
          this._renderSimpleMode(page, count, disabled);
        } else {
          this._renderPageItems(page, disabled);
        }

        this._renderNavBtn(
          'next',
          '_chevron-right',
          'Next page',
          disabled || isLast,
          this._handleNextClick,
        );

        if (this.showFirstLast)
          this._renderNavBtn(
            'last',
            '_chevrons-right',
            'Last page',
            disabled || isLast,
            this._handleLastClick,
          );
      });
    });
  }
}

Pagination.define('pagination');

declare global {
  interface HTMLElementTagNameMap {
    'ae-pagination': Pagination;
  }
}

export default Pagination;
export type PaginationProps = InferProps<typeof Pagination>;
