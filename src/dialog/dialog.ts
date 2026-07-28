import type { InferProps, Props } from 'aeico';
import styleVariables from '../styles/variables.css';
import style from '../styles/components/dialog.css';
import AeicoComponent from '../aeico-component';
import { html, tags } from 'aeico';
import '../icon/icon';

class Dialog extends AeicoComponent {
  static props: Props = {
    label: { type: String },
    width: { type: String },
    height: { type: String },
    modal: { type: Boolean },
    closable: { type: Boolean },
    header: { type: Boolean },
    closeOnOverlayClick: { type: Boolean },
  };

  declare label?: string;
  declare width?: string;
  declare height?: string;
  declare modal?: boolean;
  declare closable?: boolean;
  declare header?: boolean;
  declare closeOnOverlayClick?: boolean;

  protected static styles = [styleVariables, style];

  private _dialogEl: HTMLDialogElement | null = null;
  private _hasFooter = false;

  protected render() {
    return html(({ dialog, div, header, footer, span, button, slot }) => {
      this._dialogEl = dialog(
        {
          '@click': this._handleDialogClick,
          '@close': this._handleNativeClose,
          style: {
            width: this.width || '',
            height: this.height || '',
          },
        },
        () => {
          if (this.header !== false) {
            header({}, () => {
              slot({ name: 'header' }, () => {
                span({ className: 'label', textContent: this.label || '' });
              });
              if (this.closable !== false) {
                const { aeIcon } = tags;
                button(
                  {
                    className: 'close-btn',
                    'aria-label': 'close',
                    '@click': () => this.close(),
                  },
                  () => {
                    aeIcon({ name: 'close' });
                  },
                );
              }
            });
          }

          div({ className: 'body' }, () => {
            slot();
          });

          footer(
            {
              style: { display: this._hasFooter ? '' : 'none' },
            },
            () => {
              slot({ name: 'footer', '@slotchange': this._handleFooterSlotChange });
            },
          );
        },
      );
    });
  }

  private _handleDialogClick = (e: Event) => {
    const mouseEvent = e as MouseEvent;
    const path = mouseEvent.composedPath();

    for (const el of path) {
      if (el instanceof Element && el.hasAttribute('data-close')) {
        this.close();
        return;
      }
      if (el === this._dialogEl) break;
    }

    if (this.modal !== false && this.closeOnOverlayClick !== false) {
      if (mouseEvent.target === this._dialogEl) {
        const rect = this._dialogEl!.getBoundingClientRect();
        const outside =
          mouseEvent.clientX < rect.left ||
          mouseEvent.clientX > rect.right ||
          mouseEvent.clientY < rect.top ||
          mouseEvent.clientY > rect.bottom;
        if (outside) {
          this.close();
        }
      }
    }
  };

  private _handleNativeClose = () => {
    this.emit('close', { detail: { target: this } });
  };

  private _handleFooterSlotChange = (e: Event) => {
    const slotEl = e.target as HTMLSlotElement;
    const hasContent = slotEl.assignedElements().length > 0;
    if (hasContent !== this._hasFooter) {
      this._hasFooter = hasContent;
      this.update();
    }
  };

  open() {
    if (!this._dialogEl) return;
    if (this.modal !== false) {
      this._dialogEl.showModal();
    } else {
      this._dialogEl.show();
    }
    this.emit('open', { detail: { target: this } });
  }

  close() {
    this._dialogEl?.close();
  }

  isOpen(): boolean {
    return this._dialogEl?.open ?? false;
  }
}

Dialog.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-dialog': Dialog;
  }
}

export default Dialog;
export type DialogProps = InferProps<typeof Dialog>;
