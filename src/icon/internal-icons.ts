/**
 * Component-internal icons. These are functional icons the components rely on
 * (expand toggles, close buttons, etc.). They are registered in a protected
 * namespace (names start with "__") and cannot be overridden or shadowed by
 * user registrations, so component behavior stays intact.
 *
 * This module is intentionally NOT exported from src/icon/index.ts.
 *
 * All paths use the Material Design 24x24 viewBox.
 */
import IconRegistry from './registry';
import { getInternalName } from '../utils/icon';

IconRegistry.addInternal({
  [getInternalName('copy')]:
    'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z',
  [getInternalName('check')]: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  [getInternalName('chevron-left')]: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z',
  [getInternalName('chevron-right')]: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
  [getInternalName('chevron-up')]: 'M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z',
  [getInternalName('chevron-down')]: 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z',
  [getInternalName('chevrons-left')]: 'M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z',
  [getInternalName('chevrons-right')]: 'M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z',
  [getInternalName('close')]:
    'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  [getInternalName('ellipsis')]:
    'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
  [getInternalName('filter')]: 'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z',
  [getInternalName('visible')]:
    'M12 6C5.188 6 1 12 1 12s4.188 6 11 6s11-6 11-6s-4.188-6-11-6m0 10c-3.943 0-6.926-2.484-8.379-4c1.04-1.085 2.862-2.657 5.254-3.469A3.96 3.96 0 0 0 8 11a4 4 0 0 0 8 0a3.96 3.96 0 0 0-.875-2.469c2.393.812 4.216 2.385 5.254 3.469c-1.455 1.518-4.437 4-8.379 4',
  [getInternalName('not-visible')]:
    'M1 12s4.188-6 11-6c.947 0 1.839.121 2.678.322L8.36 12.64A4 4 0 0 1 8 11c0-.937.335-1.787.875-2.469c-2.392.812-4.214 2.385-5.254 3.469a15 15 0 0 0 2.98 2.398l-1.453 1.453C2.497 14.13 1 12 1 12m22 0s-4.188 6-11 6c-.946 0-1.836-.124-2.676-.323L5 22l-1.5-1.5l17-17L22 5l-3.147 3.147C21.501 9.869 23 12 23 12m-2.615.006a14.8 14.8 0 0 0-2.987-2.403L16 11a4 4 0 0 1-4 4l-.947.947c.31.031.624.053.947.053c3.978 0 6.943-2.478 8.385-3.994',
});
