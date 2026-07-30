import { AeicoElement } from 'aeico';

const TAG_NAME_PREFIX = 'ae';

/**
 * AeicoComponent is the base class for all built-in Aeico components.
 */
class AeicoComponent extends AeicoElement {
  static define(name: string) {
    const prefix = `${TAG_NAME_PREFIX}-`;

    const tagName = name.startsWith(prefix) ? name : `${prefix}${name}`;

    super.define(tagName);
  }
}

export default AeicoComponent;
