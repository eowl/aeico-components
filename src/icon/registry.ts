import { IconDefinition, defaultViewBox } from './defines';

function normalize(data: string | IconDefinition): IconDefinition {
  if (typeof data === 'string') {
    if (data.trimStart().startsWith('<svg')) {
      return { rawSvg: data };
    }
    
    return { paths: data, viewBox: defaultViewBox };
  }

  if ('rawSvg' in data) {
    return { rawSvg: data.rawSvg, viewBox: data.viewBox ?? defaultViewBox };
  }

  return data;
}

class IconRegistry {
  private static _icons: Map<string, IconDefinition> = new Map();
  private static _builtInKeys: Set<string> = new Set();
  private static _internalIcons: Map<string, IconDefinition> = new Map();

  static add(icons: Record<string, string | IconDefinition>) {
    for (const [name, data] of Object.entries(icons)) {
      if (name.startsWith('_')) {
        console.warn(
          `[aeico] Icon name "${name}" is reserved for library-internal icons and cannot be registered.`,
        );
        continue;
      }
      this._icons.set(name, normalize(data));
      this._builtInKeys.delete(name);
    }
  }

  static addBuiltIn(icons: Record<string, string | IconDefinition>) {
    for (const [name, data] of Object.entries(icons)) {
      if (this._icons.has(name) && !this._builtInKeys.has(name)) continue;
      this._icons.set(name, normalize(data));
      this._builtInKeys.add(name);
    }
  }

  static addInternal(icons: Record<string, string | IconDefinition>) {
    for (const [name, data] of Object.entries(icons)) {
      if (!name.startsWith('_')) {
        console.warn(`[aeico] Internal icon name "${name}" must start with "_". Skipped.`);
        continue;
      }
      this._internalIcons.set(name, normalize(data));
    }
  }

  static get(name: string): IconDefinition | undefined {
    return this._internalIcons.get(name) ?? this._icons.get(name);
  }

  static has(name: string): boolean {
    return this._internalIcons.has(name) || this._icons.has(name);
  }
}

export default IconRegistry;
