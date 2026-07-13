import type { InferProps } from 'aeico';
import styleVariables from '../styles/variables.css?inline';
import style from '../styles/components/drawer.css?inline';
import AeicoComponent from '../aeico-component';
import { html, prop, tags } from 'aeico';
import type { DrawerPlacement } from './defines';
import '../icon/icon';

class Drawer extends AeicoComponent {
  protected static styles = [styleVariables, style];

  @prop({ type: String })
  accessor label: string | undefined;

  @prop({ type: String })
  accessor placement: DrawerPlacement | undefined;

  @prop({ type: String })
  accessor size: string | undefined;

  @prop({ type: Boolean })
  accessor modal: boolean = true;

  @prop({ type: Boolean })
  accessor closable: boolean = true;

  @prop({ type: Boolean })
  accessor header: boolean = true;

  @prop({ type: Boolean })
  accessor closeOnOverlayClick: boolean = true;

  private _panelEl: HTMLDivElement | null = null;
  private _hasFooter = false;

  protected render() {
    const placement = this.placement || 'right';
    const isVertical = placement === 'top' || placement === 'bottom';

    return html(({ div, header, footer, span, button, slot }) => {
      // Backdrop (modal only)
      if (this.modal) {
        div({ className: 'backdrop', '@click': this._handleBackdropClick });
      }

      // Panel
      this._panelEl = div(
        {
          className: `panel placement-${placement}`,
          role: 'dialog',
          'aria-modal': this.modal ? 'true' : 'false',
          'aria-label': this.label,
          tabindex: '-1',
          '@click': this._handlePanelClick,
          style: {
            [isVertical ? 'height' : 'width']: this.size || '',
          },
        },
        () => {
          // Header
          if (this.header) {
            header({}, () => {
              slot({ name: 'header' }, () => {
                span({ className: 'label', textContent: this.label || '' });
              });
              if (this.closable) {
                const { aeIcon } = tags;
                button({
                  className: 'close-btn',
                  'aria-label': 'close',
                  '@click': () => this.close(),
                }, () => {
                  aeIcon({ name: 'close' });
                });
              }
            });
          }

          // Body
          div({ className: 'body' }, () => {
            slot();
          });

          // Footer — always rendered to capture slotchange, hidden when empty
          footer({ style: { display: this._hasFooter ? '' : 'none' } }, () => {
            slot({ name: 'footer', '@slotchange': this._handleFooterSlotChange });
          });
        },
      );
    });
  }

  private _handleBackdropClick = () => {
    if (this.closeOnOverlayClick) {
      this.close();
    }
  };

  private _handlePanelClick = (e: Event) => {
    const path = (e as MouseEvent).composedPath();
    for (const el of path) {
      if (el instanceof Element && el.hasAttribute('data-close')) {
        this.close();
        return;
      }
      if (el === this._panelEl) break;
    }
  };

  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      this.close();
    }
  };

  private _handleFooterSlotChange = (e: Event) => {
    const slotEl = e.target as HTMLSlotElement;
    const hasContent = slotEl.assignedElements().length > 0;
    if (hasContent !== this._hasFooter) {
      this._hasFooter = hasContent;
      this.update();
    }
  };

  private _closeTimeout: ReturnType<typeof setTimeout> | null = null;

  open() {
    clearTimeout(this._closeTimeout!);
    this.removeAttribute('data-closing');
    this.setAttribute('data-open', '');
    document.addEventListener('keydown', this._handleKeydown);
    requestAnimationFrame(() => {
      const btn = this.shadowRoot?.querySelector<HTMLElement>('.close-btn');
      (btn ?? this._panelEl)?.focus();
    });
    this.emit('open', { detail: { target: this } });
  }

  close() {
    if (this.hasAttribute('data-closing')) return;
    this.setAttribute('data-closing', '');
    document.removeEventListener('keydown', this._handleKeydown);
    this._closeTimeout = setTimeout(() => {
      this.removeAttribute('data-open');
      this.removeAttribute('data-closing');
      this.emit('close', { detail: { target: this } });
    }, 220);
  }

  isOpen(): boolean {
    return this.hasAttribute('data-open');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._closeTimeout!);
    document.removeEventListener('keydown', this._handleKeydown);
  }
}

Drawer.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-drawer': Drawer;
  }
}

export default Drawer;
export type DrawerProps = InferProps<typeof Drawer>;
