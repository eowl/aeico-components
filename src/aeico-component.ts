import { AeicoElement } from 'aeico';
import { toKebab } from './utils';

const TAG_NAME_PREFIX = 'ae';

/**
 * AeicoComponent is the base class for all built-in Aeico components.
 */
class AeicoComponent extends AeicoElement {
  static register(name?: string) {
    const tagName = name || `${TAG_NAME_PREFIX}-${this.tagName || toKebab(this.name)}`;

    super.register(tagName);
  }
}

export default AeicoComponent;
