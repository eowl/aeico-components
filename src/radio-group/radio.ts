import AeicoComponent from '../aeico-component';
import type { InferProps, Props } from 'aeico';

/**
 * AeRadio — structured option element for ae-radio-group.
 *
 * Replaces the native `<option>` approach with a custom element that is
 * fully extensible.  Current surface:
 *   - `value`    — option value submitted / matched against radio-group value
 *   - `disabled` — disables this individual option (independent of the group)
 *   - Light DOM  — label content; can be plain text or rich HTML (icons, etc.)
 *
 * This element has **no shadow DOM** — it is a pure data / content carrier.
 * ae-radio-group reads its properties and light-DOM content, then renders
 * the appropriate UI (radio input, button, segmented pill, …).
 *
 * @example Plain text options
 * ```html
 * <ae-radio-group mode="button" color="primary" value="a">
 *   <ae-radio value="a">Option A</ae-radio>
 *   <ae-radio value="b">Option B</ae-radio>
 *   <ae-radio value="c" disabled>Option C</ae-radio>
 * </ae-radio-group>
 * ```
 *
 * @example Rich content options (icons)
 * ```html
 * <ae-radio-group mode="button" color="primary" value="list">
 *   <ae-radio value="list"><ae-icon name="list"></ae-icon> List</ae-radio>
 *   <ae-radio value="grid"><ae-icon name="grid"></ae-icon> Grid</ae-radio>
 * </ae-radio-group>
 * ```
 */
class Radio extends AeicoComponent {
  static tagName = 'radio';

  /** No shadow DOM — this element is a transparent data/content carrier. */
  static override useShadowDOM = false;

  static override props: Props = {
    value: { type: String },
    disabled: { type: Boolean },
  };

  declare value: string;
  declare disabled?: boolean;
}

Radio.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-radio': Radio;
  }
}

export default Radio;
export type RadioProps = InferProps<typeof Radio>;
