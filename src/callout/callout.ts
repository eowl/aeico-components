import type { InferProps } from 'aeico';
import styleVariables from '../styles/variables.css';
import colorCSS from '../styles/color.css';
import calloutStyle from '../styles/components/callout.css';
import AeicoComponent from '../aeico-component';
import { html } from 'aeico';
import type { CalloutVariant, CalloutColor } from './defines';
import { prop } from 'aeico';

class Callout extends AeicoComponent {
  protected static styles = [styleVariables, colorCSS, calloutStyle];

  @prop({ type: String })
  accessor color: CalloutColor = 'default';

  @prop({ type: String })
  accessor variant: CalloutVariant = 'filled';

  @prop({ type: Boolean })
  accessor accent = false;

  protected render() {
    return html(({ div, slot }) => {
      div({ className: 'callout', part: 'callout' }, () => {
        div({ className: 'header-row', part: 'header-row' }, () => {
          div({ className: 'icon', part: 'icon' }, () => {
            slot({ name: 'icon', '@slotchange': (e: Event) => this._onIconSlotChange(e) });
          });
          div({ className: 'header', part: 'header' }, () => {
            slot({ name: 'header', '@slotchange': (e: Event) => this._onHeaderSlotChange(e) });
          });
        });
        div({ className: 'body', part: 'body' }, () => {
          slot();
        });
      });
    });
  }

  private _onIconSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this.toggleAttribute('has-icon', slot.assignedNodes({ flatten: true }).length > 0);
  }

  private _onHeaderSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this.toggleAttribute('has-header', slot.assignedNodes({ flatten: true }).length > 0);
  }
}

Callout.define('callout');

declare global {
  interface HTMLElementTagNameMap {
    'ae-callout': Callout;
  }
}

export default Callout;
export type CalloutProps = InferProps<typeof Callout>;
