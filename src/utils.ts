export const SVG_NS = 'http://www.w3.org/2000/svg';

export function toKebab(str: string): string {
  const cleaned = str.replace(/^[_\d]+/, '');

  return cleaned.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
