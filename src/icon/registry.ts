import { IconDefinition, IconRegistryData, defaultViewBox } from './defines';

class IconRegistry {
  private static _icons: Map<string, IconDefinition> = new Map();
  /** Names registered via addBuiltIn - can be overridden by user add() calls */
  private static _builtInKeys: Set<string> = new Set();
  /**
   * Component-internal icons. Stored separately from user icons and can never
   * be overridden. Names must start with "_" so they never collide with the
   * user namespace.
   */
  private static _internalIcons: Map<string, IconDefinition> = new Map();

  /** Register user icons. Always takes priority over built-in icons.
   * Names starting with "_" are reserved for library-internal icons and are
   * rejected here. */
  static add(icons: IconRegistryData) {
    for (const [name, data] of Object.entries(icons)) {
      if (name.startsWith('_')) {
        console.warn(
          `[aeico] Icon name "${name}" is reserved for library-internal icons and cannot be registered.`
        );
        continue;
      }
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

  /**
   * Register component-internal icons. Intended for library-internal use only;
   * not exported from the package entry. Internal icons live in their own
   * namespace (names must start with "_") and can never be overridden by
   * user registrations.
   */
  static addInternal(icons: IconRegistryData) {
    for (const [name, data] of Object.entries(icons)) {
      if (!name.startsWith('_')) {
        console.warn(
          `[aeico] Internal icon name "${name}" must start with "_". Skipped.`
        );
        continue;
      }
      if (typeof data === 'string') {
        this._internalIcons.set(name, { paths: data, viewBox: defaultViewBox });
      } else {
        this._internalIcons.set(name, data);
      }
    }
  }

  static get(name: string): IconDefinition | undefined {
    // Internal icons win over user icons: they are functional icons the
    // components depend on and must not be shadowed, even by a same-named
    // user registration (which is rejected for "_" names anyway).
    return this._internalIcons.get(name) ?? this._icons.get(name);
  }

  static has(name: string): boolean {
    return this._internalIcons.has(name) || this._icons.has(name);
  }
}

export default IconRegistry;
