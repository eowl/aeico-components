import { IconDefinition, IconRegistryData, defaultViewBox } from './defines'

class IconRegistry {
  private static _icons: Map<string, IconDefinition> = new Map();

  static add(icons: IconRegistryData) {
    for (const [name, data] of Object.entries(icons)) {
      if (typeof data === 'string') {
        this._icons.set(name, { path: data, viewBox: defaultViewBox });
      } else {
        this._icons.set(name, data);
      }
    }
  }

  static get(name: string): IconDefinition | undefined {
    return this._icons.get(name);
  }

  static has(name: string): boolean {
    return this._icons.has(name);
  }
}

export default IconRegistry
