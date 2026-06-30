import { IconDefinition, IconRegistryData, defaultViewBox } from './defines';

class IconRegistry {
  private static _icons: Map<string, IconDefinition> = new Map();
  /** Names registered via addBuiltIn — can be overridden by user add() calls */
  private static _builtInKeys: Set<string> = new Set();

  /** Register user icons. Always takes priority over built-in icons. */
  static add(icons: IconRegistryData) {
    for (const [name, data] of Object.entries(icons)) {
      if (typeof data === 'string') {
        this._icons.set(name, { paths: data, viewBox: defaultViewBox });
      } else {
        this._icons.set(name, data);
      }
      // Mark as user-defined (removes built-in status)
      this._builtInKeys.delete(name);
    }
  }

  /**
   * Register built-in icons provided by the library.
   * A built-in icon will NOT overwrite an icon already registered by the user.
   */
  static addBuiltIn(icons: IconRegistryData) {
    for (const [name, data] of Object.entries(icons)) {
      // Skip if the user has already registered this icon
      if (this._icons.has(name) && !this._builtInKeys.has(name)) continue;
      if (typeof data === 'string') {
        this._icons.set(name, { paths: data, viewBox: defaultViewBox });
      } else {
        this._icons.set(name, data);
      }
      this._builtInKeys.add(name);
    }
  }

  static get(name: string): IconDefinition | undefined {
    return this._icons.get(name);
  }

  static has(name: string): boolean {
    return this._icons.has(name);
  }
}

export default IconRegistry;
