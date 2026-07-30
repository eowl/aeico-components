import AeicoField from '../aeico-field';
import type { InferProps } from 'aeico';
import { html, prop } from 'aeico';
import variables from '../styles/variables.css';
import sizeCSS from '../styles/size.css';
import fieldLabelCSS from '../styles/components/field-label.css';
import actionButtonCSS from '../styles/components/action-button.css';
import style from '../styles/components/textarea.css';

export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

class Textarea extends AeicoField {
  protected fieldElement: HTMLTextAreaElement | null = null;

  @prop({ type: String })
  accessor placeholder: string | undefined;

  @prop({ type: Number })
  accessor rows: number | undefined;

  @prop({ type: Number })
  accessor maxlength: number | undefined;

  @prop({ type: Number })
  accessor minlength: number | undefined;

  @prop({ type: String })
  accessor resize: TextareaResize | undefined;

  @prop({ type: Boolean })
  accessor autoResize: boolean = false;

  protected static styles = [variables, sizeCSS, fieldLabelCSS, actionButtonCSS, style];

  private readonly _boundOnInput = () => {
    if (this.autoResize && this.fieldElement) {
      this._syncAutoResize(this.fieldElement);
    }
    this.setValue(this.getValue(), { silent: false, action: 'change' });
  };

  render() {
    return html(({ div, textarea }) => {
      const id = this.getFieldId();
      this.renderLabel(id);
      div({ className: 'textarea-container field-body' }, () => {
        this.fieldElement = textarea({
          id,
          placeholder: this.placeholder || '',
          rows: this.rows ?? 3,
          required: Boolean(this.required),
          '@input': this._boundOnInput,
        });
        this.renderActionButtons();
      });
      this.renderHelperText();
      this.renderError();

      if (this.fieldElement) {
        if (this.value != null) {
          this.fieldElement.value = String(this.value);
        }
        if (this.maxlength != null) this.fieldElement.maxLength = this.maxlength;
        if (this.minlength != null) this.fieldElement.minLength = this.minlength;
        this.fieldElement.style.resize = this.autoResize ? 'none' : (this.resize ?? 'vertical');
        if (this.autoResize) {
          this._syncAutoResize(this.fieldElement);
        }
        this._updateClearButtonVisibility();
      }
    });
  }

  private _syncAutoResize(ta: HTMLTextAreaElement): void {
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  }

  private _updateClearButtonVisibility(): void {
    if (this.clearBtn && this.fieldElement) {
      this.clearBtn.style.display = this.fieldElement.value.length > 0 ? '' : 'none';
    }
  }

  protected writeValue(value: string): void {
    if (this.fieldElement) {
      this.fieldElement.value = String(value || '');
      if (this.autoResize) {
        this._syncAutoResize(this.fieldElement);
      }
      this._updateClearButtonVisibility();
    }
  }
}

Textarea.define('textarea');

declare global {
  interface HTMLElementTagNameMap {
    'ae-textarea': Textarea;
  }
}

export default Textarea;
export type TextareaProps = InferProps<typeof Textarea>;
