import type { InferProps } from 'aeico';
import styleVariables from '../styles/variables.css';
import style from '../styles/components/image.css';
import AeicoComponent from '../aeico-component';
import { html, prop } from 'aeico';
import type { ImageFit } from './defines';
import '../icon/icon';

interface ImageViewerItem {
  src: string;
  alt: string;
  caption: string;
}

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const CLOSE_ANIMATION_MS = 220;

/**
 * Image Component
 *
 * Displays an image with an optional dark semi-transparent caption overlay.
 * Clicking the image opens a fullscreen viewer with zoom (wheel / double click),
 * drag panning, and grouped navigation when the `group` attribute is shared.
 *
 * @example
 * ```html
 * <ae-image src="photo.jpg" caption="A sunset"></ae-image>
 * <ae-image src="a.jpg" group="gallery"></ae-image>
 * <ae-image src="b.jpg" group="gallery"></ae-image>
 * ```
 */
class Image extends AeicoComponent {
  protected static styles = [styleVariables, style];

  @prop({ type: String })
  accessor src: string = '';

  @prop({ type: String })
  accessor alt: string = '';

  @prop({ type: Number })
  accessor width: number | undefined;

  @prop({ type: Number })
  accessor height: number | undefined;

  @prop({ type: String })
  accessor caption: string = '';

  @prop({ type: Boolean })
  accessor zoomable: boolean = true;

  @prop({ type: String })
  accessor group: string = '';

  @prop({ type: String })
  accessor fit: ImageFit = 'cover';

  private _items: ImageViewerItem[] | null = null;
  private _index = 0;

  private _scale = MIN_SCALE;
  private _tx = 0;
  private _ty = 0;
  private _dragging = false;
  private _startX = 0;
  private _startY = 0;
  private _startTx = 0;
  private _startTy = 0;

  private _viewerImgEl: HTMLImageElement | null = null;
  private _stageEl: HTMLDivElement | null = null;
  private _hasCaptionSlot = false;
  private _closeTimeout: ReturnType<typeof setTimeout> | null = null;

  protected render() {
    this._applySize();

    const current = this._currentItem();
    const hasGroupNav = this._items !== null && this._items.length > 1;

    return html(({ figure, img, div, button, span, slot, aeIcon }) => {
      figure({ className: 'thumb', part: 'image', '@click': this._handleThumbClick }, () => {
        img({ className: 'thumb-img', part: 'img', src: this.src, alt: this.alt, loading: 'lazy' });
        div(
          {
            className: 'caption',
            part: 'caption',
            style: { display: this.caption !== '' || this._hasCaptionSlot ? '' : 'none' },
          },
          () => {
            if (this.caption !== '') {
              span({ textContent: this.caption });
            } else {
              slot({ '@slotchange': this._handleCaptionSlotChange });
            }
          },
        );
      });

      div(
        {
          className: 'viewer',
          role: 'dialog',
          'aria-modal': 'true',
          'aria-label': current.alt || current.caption || 'image preview',
        },
        () => {
          div({ className: 'backdrop', '@click': this._handleBackdropClick });

          this._stageEl = div(
            {
              className: 'stage',
              '@wheel': this._handleWheel,
              '@dblclick': this._handleDblClick,
              '@pointerdown': this._handlePointerDown,
              '@pointermove': this._handlePointerMove,
              '@pointerup': this._handlePointerUp,
              '@pointercancel': this._handlePointerUp,
            },
            () => {
              this._viewerImgEl = img({
                className: 'viewer-img',
                src: current.src,
                alt: current.alt,
                draggable: 'false',
                style: { transform: this._transform() },
              });
            },
          );

          button({ className: 'tool-btn close-btn', 'aria-label': 'close', '@click': () => this.close() }, () => {
            aeIcon({ name: 'close' });
          });

          if (hasGroupNav) {
            span({ className: 'count', textContent: `${this._index + 1} / ${this._items!.length}` });
            button(
              { className: 'tool-btn nav-btn prev', 'aria-label': 'previous image', '@click': () => this._step(-1) },
              () => {
                aeIcon({ name: 'chevron-left' });
              },
            );
            button(
              { className: 'tool-btn nav-btn next', 'aria-label': 'next image', '@click': () => this._step(1) },
              () => {
                aeIcon({ name: 'chevron-right' });
              },
            );
          }

          if (current.caption !== '') {
            div({ className: 'viewer-caption', textContent: current.caption });
          }
        },
      );
    });
  }

  private _currentItem(): ImageViewerItem {
    return this._items?.[this._index] ?? { src: this.src, alt: this.alt, caption: this.caption };
  }

  private _applySize(): void {
    if (this.width != null) {
      this.style.setProperty('--ae-image-width', `${this.width}px`);
    } else {
      this.style.removeProperty('--ae-image-width');
    }
    if (this.height != null) {
      this.style.setProperty('--ae-image-height', `${this.height}px`);
    } else {
      this.style.removeProperty('--ae-image-height');
    }
  }

  private _transform(): string {
    return `translate(${this._tx}px, ${this._ty}px) scale(${this._scale})`;
  }

  private _collectGroup(): void {
    this._items = null;
    this._index = 0;
    if (this.group === '') return;
    // Filter instead of building a selector to avoid escaping issues
    const nodes = Array.from(document.querySelectorAll<Image>('ae-image')).filter((el) => el.group === this.group);
    if (nodes.length < 2) return;
    this._items = nodes.map((el) => ({ src: el.src, alt: el.alt, caption: el.caption }));
    this._index = nodes.indexOf(this);
  }

  private _resetTransform(): void {
    this._scale = MIN_SCALE;
    this._tx = 0;
    this._ty = 0;
    this._dragging = false;
    this._applyTransform();
  }

  private _setScale(scale: number): void {
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
    if (next === this._scale) return;
    this._scale = next;
    if (this._scale === MIN_SCALE) {
      this._tx = 0;
      this._ty = 0;
    }
    this._applyTransform();
  }

  private _applyTransform(): void {
    if (!this._viewerImgEl) return;
    this._viewerImgEl.style.transform = this._transform();
    this._viewerImgEl.style.transition = this._dragging ? 'none' : '';
    if (this._stageEl) {
      this._stageEl.style.cursor = this._scale > 1 ? (this._dragging ? 'grabbing' : 'grab') : '';
    }
  }

  private _step(offset: number): void {
    if (!this._items || this._items.length < 2) return;
    const length = this._items.length;
    this._index = (this._index + offset + length) % length;
    this._resetTransform();
    this.update();
  }

  private _handleThumbClick = () => {
    if (this.zoomable) {
      this.open();
    }
  };

  private _handleBackdropClick = () => {
    this.close();
  };

  private _handleCaptionSlotChange = (e: Event) => {
    const slotEl = e.target as HTMLSlotElement;
    const hasContent = slotEl.assignedNodes().some((node) => node.textContent?.trim() !== '');
    if (hasContent !== this._hasCaptionSlot) {
      this._hasCaptionSlot = hasContent;
      this.update();
    }
  };

  private _handleWheel = (e: WheelEvent) => {
    if (!this.isOpen()) return;
    e.preventDefault();
    this._setScale(this._scale + (e.deltaY < 0 ? 0.25 : -0.25));
  };

  private _handleDblClick = () => {
    this._setScale(this._scale > MIN_SCALE ? MIN_SCALE : 2);
  };

  private _handlePointerDown = (e: PointerEvent) => {
    if (this._scale <= MIN_SCALE) return;
    this._dragging = true;
    this._startX = e.clientX;
    this._startY = e.clientY;
    this._startTx = this._tx;
    this._startTy = this._ty;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this._applyTransform();
  };

  private _handlePointerMove = (e: PointerEvent) => {
    if (!this._dragging) return;
    this._tx = this._startTx + (e.clientX - this._startX);
    this._ty = this._startTy + (e.clientY - this._startY);
    this._applyTransform();
  };

  private _handlePointerUp = (e: PointerEvent) => {
    if (!this._dragging) return;
    this._dragging = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    this._applyTransform();
  };

  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      this.close();
    } else if (e.key === 'ArrowLeft') {
      this._step(-1);
    } else if (e.key === 'ArrowRight') {
      this._step(1);
    }
  };

  open() {
    if (!this.zoomable || this.isOpen()) return;
    this._collectGroup();
    clearTimeout(this._closeTimeout!);
    this.removeAttribute('data-closing');
    this._resetTransform();
    this.setAttribute('data-open', '');
    document.addEventListener('keydown', this._handleKeydown);
    this.update();
    this.emit('open', { detail: { target: this } });
  }

  close() {
    if (!this.isOpen()) return;
    this.setAttribute('data-closing', '');
    document.removeEventListener('keydown', this._handleKeydown);
    this._closeTimeout = setTimeout(() => {
      this.removeAttribute('data-open');
      this.removeAttribute('data-closing');
      this.emit('close', { detail: { target: this } });
    }, CLOSE_ANIMATION_MS);
  }

  isOpen(): boolean {
    return this.hasAttribute('data-open') && !this.hasAttribute('data-closing');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._closeTimeout!);
    document.removeEventListener('keydown', this._handleKeydown);
  }
}

Image.define('image');

declare global {
  interface HTMLElementTagNameMap {
    'ae-image': Image;
  }
}

export default Image;
export type ImageProps = InferProps<typeof Image>;
