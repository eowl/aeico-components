import { AeicoElement } from 'aeico';

const TAG_NAME_PREFIX = 'ae';

/**
 * AeicoComponent is the base class for all built-in Aeico components.
 */
class AeicoComponent extends AeicoElement {
  static register(name?: string) {
    const tagName = name || (this.tagName && `${TAG_NAME_PREFIX}-${this.tagName}`);

    if (!tagName) {
      throw new Error(
        `${this.name}: unable to determine tag name. Either call register('tag-name') or set "static tagName = '...'" on the class.`,
      );
    }

    super.register(tagName);
  }
}

export default AeicoComponent;
