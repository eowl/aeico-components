import type { InferProps } from 'aeico';
import styleVariables from '../styles/variables.css';
import style from '../styles/components/list-item.css';
import AeicoComponent from '../aeico-component';
import { html, prop } from 'aeico';
import '../divider';

/**
 * ListItem Component
 *
 * A single row inside `<ae-list>`. Supports a `prefix` icon slot, a
 * `description` secondary text line and a visual `disabled` state.
 *
 * The `divided` attribute is normally synced from the parent `ae-list`;
 * it can also be set directly when the item is used standalone.
 *
 * @example
 * ```html
 * <ae-list divided>
 *   <ae-list-item key="profile" description="Account settings">
 *     <ae-icon name="user" slot="prefix"></ae-icon>
 *     Profile
 *   </ae-list-item>
 * </ae-list>
 * ```
 */
class ListItem extends AeicoComponent {
  protected static styles = [styleVariables, style];

  @prop({ type: String })
  accessor key: string | undefined;

  @prop({ type: Boolean })
  accessor disabled: boolean = false;

  @prop({ type: String })
  accessor description: string | undefined;

  @prop({ type: Boolean })
  accessor divided: boolean = false;

  @prop({ type: Boolean })
  accessor selected: boolean = false;

  protected render() {
    return html(({ div, span, slot, aeDivider }) => {
      div(
        {
          className: {
            item: true,
            'item--selected': this.selected,
          },
          part: 'item',
          role: 'listitem',
          'aria-disabled': this.disabled ? 'true' : undefined,
          'aria-selected': this.selected ? 'true' : undefined,
          '@click': this._handleClick,
        },
        () => {
          if (this.divided) {
            aeDivider({ className: 'item-divider', part: 'divider' });
          }
          div({ className: 'body', part: 'body' }, () => {
            div({ className: 'row', part: 'row' }, () => {
              span({ className: 'prefix', part: 'prefix' }, () => {
                slot({ name: 'prefix' });
              });
              span({ className: 'label', part: 'label' }, () => {
                slot();
              });
            });
            if (this.description) {
              div({
                className: 'description',
                part: 'description',
                textContent: this.description,
              });
            }
          });
        },
      );
    });
  }

  private _handleClick = (): void => {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent('_list-item-select', {
        bubbles: true,
        composed: true,
        detail: { key: this.key ?? '' },
      }),
    );
  };
}

ListItem.define('list-item');

declare global {
  interface HTMLElementTagNameMap {
    'ae-list-item': ListItem;
  }
}

export default ListItem;
export type ListItemProps = InferProps<typeof ListItem>;
