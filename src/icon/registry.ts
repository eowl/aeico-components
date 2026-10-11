import { IconDefinition, defaultViewBox } from './defines';
import { INTERNAL_ICON_PREFIX, SHARED_ICON_REGISTRY_KEY } from '../constants';

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

function getSharedIcons(): Map<string, IconDefinition> {
  const scope = globalThis as typeof globalThis & Record<symbol, unknown>;

  return (scope[SHARED_ICON_REGISTRY_KEY] ??= new Map<string, IconDefinition>()) as Map<
    string,
    IconDefinition
  >;
}

class IconRegistry {
  private static _icons: Map<string, IconDefinition> = new Map();
  private static _internalIcons: Map<string, IconDefinition> = new Map();

  static add(icons: Record<string, string | IconDefinition>) {
    for (const [name, data] of Object.entries(icons)) {
      if (name.startsWith(INTERNAL_ICON_PREFIX)) {
        console.warn(
          `[aeico components] Icon name "${name}" is reserved for library-internal icons and cannot be registered.`,
        );
        continue;
      }
      this._icons.set(name, normalize(data));
    }
  }

  static addShared(icons: Record<string, string | IconDefinition>) {
    const shared = getSharedIcons();
    for (const [name, data] of Object.entries(icons)) {
      if (name.startsWith(INTERNAL_ICON_PREFIX)) {
        console.warn(
          `[aeico components] Icon name "${name}" is reserved for library-internal icons and cannot be registered.`,
        );
        continue;
      }
      shared.set(name, normalize(data));
    }
  }

  static addInternal(icons: Record<string, string | IconDefinition>) {
    for (const [name, data] of Object.entries(icons)) {
      if (!name.startsWith(INTERNAL_ICON_PREFIX)) {
        console.warn(
          `[aeico components] Internal icon name "${name}" must start with "${INTERNAL_ICON_PREFIX}". Skipped.`,
        );
        continue;
      }
      this._internalIcons.set(name, normalize(data));
    }
  }

  static get(name: string): IconDefinition | undefined {
    if (name.startsWith(INTERNAL_ICON_PREFIX)) {
      return this._internalIcons.get(name);
    }

    return this._icons.get(name) ?? getSharedIcons().get(name);
  }

  static has(name: string): boolean {
    if (name.startsWith(INTERNAL_ICON_PREFIX)) {
      return this._internalIcons.has(name);
    }

    return this._icons.has(name) || getSharedIcons().has(name);
  }
}

export default IconRegistry;
