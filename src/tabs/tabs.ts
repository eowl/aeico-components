import type { Props } from 'aeico';
import styleVariables from '../styles/variables.css?inline';
import tabsStyle from '../styles/components/tabs.css?inline';
import AeicoComponent from '../aeico-component';
import { html } from 'aeico';
import type Tab from './tab';

class Tabs extends AeicoComponent {
  static props: Props = {
    activeIndex: { type: Number },
  };

  declare activeIndex?: number;

  protected static styles = [styleVariables, tabsStyle];

  private _observer: MutationObserver | null = null;

  private get _tabs(): Tab[] {
    return [...this.children].filter(
      (el) => el.tagName.toLowerCase() === 'ae-tab',
    ) as unknown as Tab[];
  }

  private get _panels(): HTMLElement[] {
    return [...this.children].filter(
      (el) => el.tagName.toLowerCase() === 'ae-tab-panel',
    ) as HTMLElement[];
  }

  private _getPairs(): [Tab, HTMLElement | null][] {
    const tabs = this._tabs;
    const panels = this._panels;

    const idMap = new Map<string, HTMLElement>();
    for (const panel of panels) {
      const id = panel.id;
      if (id) idMap.set(id, panel);
    }

    const usedPanels = new Set<HTMLElement>();
    const pairs: [Tab, HTMLElement | null][] = [];

    // First pass: ID-matched tabs
    for (const tab of tabs) {
      const panelId = tab.panel;
      if (panelId) {
        const panel = idMap.get(panelId) ?? null;
        if (panel) usedPanels.add(panel);
        pairs.push([tab, panel]);
      }
    }

    // Second pass: position-matched tabs (no panel attr)
    const unmatchedPanels = panels.filter((p) => !usedPanels.has(p));
    let posIndex = 0;
    for (const tab of tabs) {
      if (!tab.panel) {
        pairs.push([tab, unmatchedPanels[posIndex] ?? null]);
        posIndex++;
      }
    }

    return pairs;
  }

  connectedCallback() {
    super.connectedCallback();
    this._observer = new MutationObserver(() => this.update());
    this._observer.observe(this, { childList: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._observer?.disconnect();
    this._observer = null;
  }

  protected onUpdated() {
    this._syncActive();
  }

  private _handleTabClick = (e: Event) => {
    const pairs = this._getPairs();
    const target = e.target as Element;
    const index = pairs.findIndex(([tab]) => tab === target);
    if (index !== -1) this.selectTab(index);
  };

  private _syncActive() {
    const activeIndex = this.activeIndex ?? 0;
    const pairs = this._getPairs();

    pairs.forEach(([tab, panel], i) => {
      const isActive = i === activeIndex;
      if (isActive) {
        tab.setAttribute('active', '');
        panel?.setAttribute('active', '');
      } else {
        tab.removeAttribute('active');
        panel?.removeAttribute('active');
      }
    });
  }

  selectTab(index: number): void {
    const pairs = this._getPairs();
    if (index === (this.activeIndex ?? 0) || index >= pairs.length) return;
    this.activeIndex = index;
    this.emit('change', { detail: { index } });
  }

  protected render() {
    return html(({ nav, div, slot }) => {
      nav({ part: 'tab-nav', role: 'tablist', '@_tab-click': this._handleTabClick }, () => {
        slot({ name: 'tab' });
      });
      div({ part: 'panels' }, () => {
        slot();
      });
    });
  }
}

Tabs.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-tabs': Tabs;
  }
}

export default Tabs;
