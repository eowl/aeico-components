import type { InferProps, Props } from 'aeico';
import AeicoComponent from '../aeico-component';
import { html } from 'aeico';
import type { IconColor } from '../icon/defines';
// Ensure ae-button and ae-icon are registered
import '../button/button';
import '../icon/icon';

export type IconButtonVariant = 'filled' | 'outlined' | 'subtle' | 'text';
export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * @deprecated Use `<ae-button>` with an `<ae-icon>` slot instead.
 *
 * ```html
 * <ae-button color="primary"><ae-icon name="star"></ae-icon></ae-button>
 * ```
 */
class IconButton extends AeicoComponent {
  static tagName = 'icon-button';

  static props: Props = {
    icon: { type: String },
    size: { type: String },
    color: { type: String },
    variant: { type: String },
    disabled: { type: Boolean },
  };

  declare icon?: string;
  declare size?: IconButtonSize;
  declare color?: IconColor;
  declare variant?: IconButtonVariant;
  declare disabled?: boolean;

  protected static styles = [':host { display: contents; }'];

  protected render() {
    return html(({ aeButton, aeIcon }) => {
      aeButton(
        {
          color: this.color,
          variant: this.variant,
          size: this.size,
          disabled: this.disabled,
        },
        () => {
          aeIcon({ name: this.icon });
        },
      );
    });
  }
}

IconButton.register();

declare global {
  interface HTMLElementTagNameMap {
    'ae-icon-button': IconButton;
  }
}

export default IconButton;
export type IconButtonProps = InferProps<typeof IconButton>;
