import type { InferProps } from 'aeico';
import styleVariables from '../styles/variables.css';
import colorCSS from '../styles/color.css';
import style from '../styles/components/list.css';
import AeicoComponent from '../aeico-component';
import { html, prop } from 'aeico';
import type { ListSelectDetail, ListVariant } from './defines';
import type ListItem from './list-item';
import './list-item';

/**
 * List Component
 *
 * A vertical container for `ae-list-item` children. Supports a `bordered`
 * variant which draws an outline, and `divided` mode which renders an
 * `ae-divider` between adjacent items (the first item never gets one).
 *
 * @example
 * ```html
 * <ae-list variant="outlined" divided>
 *   <ae-list-item key="a">Item A</ae-list-item>
 *   <ae-list-item key="b" description="Secondary text">Item B</ae-list-item>
 *   <ae-list-item key="c" disabled>Item C</ae-list-item>
 * </ae-list>
 * ```
 */
class List extends AeicoComponent {
  protected static styles = [styleVariables, colorCSS, style];

  @prop({ type: String })
  accessor variant: ListVariant = 'subtle';

  @prop({ type: Boolean })
  accessor divided: boolean = false;

  @prop({ type: String })
  accessor selectedKey: string | undefined;

  private _itemsSlot: HTMLSlotElement | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.listen('_list-item-select', this._handleItemSelect as EventListener);
  }

  protected render() {
    return html(({ div, slot }) => {
      div({ className: 'list', part: 'list', role: 'list' }, () => {
        this._itemsSlot = slot({
          '@slotchange': () => this._syncItems(),
        });
      });
    });
  }

  protected onUpdated() {
    this._syncItems();
  }

  private _getItems(): Element[] {
    return this._itemsSlot?.assignedElements() ?? [];
  }

  private _syncItems = () => {
    const items = this._getItems().filter((el) => el.localName === 'ae-list-item');
    items.forEach((el, i) => {
      el.toggleAttribute('divided', this.divided && i > 0);
    });
  };

  private _handleItemSelect = (e: CustomEvent<{ key: string }>): void => {
    const { key } = e.detail;

    const alreadySelected = this.selectedKey === key;
    this.selectedKey = alreadySelected ? undefined : key;

    this._getItems()
      .filter((el): el is ListItem => el.localName === 'ae-list-item')
      .forEach((item) => {
        item.selected = !alreadySelected && item.key === key;
      });

    this.emit('select', {
      detail: {
        key,
        selected: !alreadySelected,
        selectedKeys: this.selectedKey ? [this.selectedKey] : [],
      } satisfies ListSelectDetail,
    });
  };
}

List.define('list');

declare global {
  interface HTMLElementTagNameMap {
    'ae-list': List;
  }
}

export default List;
export type ListProps = InferProps<typeof List>;
