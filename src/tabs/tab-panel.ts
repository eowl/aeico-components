import tabPanelStyle from '../styles/components/tab-panel.css';
import AeicoComponent from '../aeico-component';
import { html } from 'aeico';

class TabPanel extends AeicoComponent {
  protected static styles = [tabPanelStyle];

  protected render() {
    return html(({ slot }) => {
      slot();
    });
  }
}

TabPanel.define('tab-panel');

declare global {
  interface HTMLElementTagNameMap {
    'ae-tab-panel': TabPanel;
  }
}

export default TabPanel;
