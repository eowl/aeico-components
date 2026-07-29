import type { InferProps } from 'aeico';
import styleVariables from '../styles/variables.css';
import colorCSS from '../styles/color.css';
import cardStyle from '../styles/components/card.css';
import AeicoComponent from '../aeico-component';
import { html } from 'aeico';
import type { CardVariant, CardColor } from './defines';
import { prop } from 'aeico';

class Card extends AeicoComponent {

  protected static styles = [styleVariables, colorCSS, cardStyle];

  @prop({ type: String })
  accessor color: CardColor = 'default';

  @prop({ type: String })
  accessor variant: CardVariant = 'filled';

  protected render() {
    return html(({ div, header, footer, slot }) => {
      div({ className: 'card', part: 'card' }, () => {
        header({ className: 'header', part: 'header' }, () => {
          slot({ name: 'header', '@slotchange': (e: Event) => this._onHeaderSlotChange(e) });
        });
        div({ className: 'body', part: 'body' }, () => {
          slot();
        });
        footer({ className: 'footer', part: 'footer' }, () => {
          slot({ name: 'footer', '@slotchange': (e: Event) => this._onFooterSlotChange(e) });
        });
      });
    });
  }

  private _onHeaderSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this.toggleAttribute('has-header', slot.assignedNodes({ flatten: true }).length > 0);
  }

  private _onFooterSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this.toggleAttribute('has-footer', slot.assignedNodes({ flatten: true }).length > 0);
  }
}

Card.define('card');

declare global {
  interface HTMLElementTagNameMap {
    'ae-card': Card;
  }
}

export default Card;
export type CardProps = InferProps<typeof Card>;
