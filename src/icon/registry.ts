import { IconDefinition, defaultViewBox } from './defines';
import { INTERNAL_ICON_PREFIX } from '../constants';

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
  private static _internalIcons: Map<string, IconDefinition> = new Map();

  static add(icons: Record<string, string | IconDefinition>) {
    for (const [name, data] of Object.entries(icons)) {
      if (name.startsWith(INTERNAL_ICON_PREFIX)) {
        console.warn(
          `[aeico] Icon name "${name}" is reserved for library-internal icons and cannot be registered.`,
        );
        continue;
      }
      this._icons.set(name, normalize(data));
    }
  }

  static addInternal(icons: Record<string, string | IconDefinition>) {
    for (const [name, data] of Object.entries(icons)) {
      if (!name.startsWith(INTERNAL_ICON_PREFIX)) {
        console.warn(
          `[aeico] Internal icon name "${name}" must start with "${INTERNAL_ICON_PREFIX}". Skipped.`,
        );
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
