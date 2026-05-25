/**
 * Built-in system icons used internally by aeico components.
 * These are pre-registered so components work out of the box.
 * Users can override any of them by calling IconRegistry.add({ 'name': '...' }).
 *
 * All paths use the Material Design 24×24 viewBox.
 */
import IconRegistry from './registry';

IconRegistry.addBuiltIn({
  'chevron-left': 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z',
  'chevron-right': 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
  'chevron-up': 'M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z',
  'chevron-down': 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z',
  'chevrons-left': 'M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z',
  'chevrons-right': 'M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z',
  close:
    'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
});
