import { INTERNAL_ICON_PREFIX } from '../constants';

/**
 * Builds the reserved internal icon name from a short key.
 *
 * Components use this instead of hard-coding the prefixed string, so the
 * prefix rule lives in exactly one place.
 *
 * @example
 * ```ts
 * getInternalName('close');        // '__close'
 * getInternalName('chevrons-left'); // '__chevrons-left'
 * ```
 */
export function getInternalName(name: string): string {
  return `${INTERNAL_ICON_PREFIX}${name}`;
}
