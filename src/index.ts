/**
 * Components module exports
 * 
 * All Aeico Web Components are available here for on-demand registration.
 * Import only the components you need to keep your bundle size small.
 * 
 * @example
 * ```typescript
 * import { SelectField, RangeField, Button } from 'aeico/components'
 * 
 * // Manually register components
 * SelectField.register()
 * RangeField.register()
 * Button.register()
 * 
 * // Or use with custom names
 * SelectField.register('my-select')
 * ```
 * 
 * @example
 * ```typescript
 * // Use the static create method for programmatic creation
 * import { Button } from 'aeico/components'
 * 
 * const button = Button.create({
 *   variant: 'primary',
 *   size: 'md'
 * })
 * button.textContent = 'Click me'
 * document.body.appendChild(button)
 * ```
 */

// Field components
export { default as TextInput } from './text-input'
export { default as Select } from './select'
export { default as Slider } from './slider'
export { default as Checkbox } from './checkbox'
export { default as RadioGroup } from './radio-group'
export { Radio } from './radio-group'
export { default as Switch } from './switch'

// UI components
export { default as Breadcrumb, BreadcrumbItem } from './breadcrumb'
export { default as Button } from './button'
export { default as Dropdown, DropdownItem, DropdownButton } from './dropdown'
export { default as ButtonGroup } from './button-group'
export { default as Badge } from './badge'
export { default as Tag } from './tag'
export { default as Alert } from './alert'
export { default as Dialog } from './dialog'
export { default as Icon } from './icon/icon'
export { default as IconRegistry } from './icon/registry'
export { default as IconButton } from './icon-button'
export { Tabs, Tab, TabPanel } from './tabs'
export { default as Divider } from './divider'
export { default as Card } from './card'
export { default as Navbar } from './navbar'
export { default as Detail } from './detail'

// Component types
export type { SelectProps, SelectOption, SelectOptions, SelectOptionValue } from './select'
export type { SliderProps, SliderOption, SliderOptions, SliderOptionValue } from './slider'
export type { CheckboxProps, CheckboxVariant } from './checkbox'
export type { RadioGroupProps, RadioGroupMode, RadioGroupOption, RadioGroupOptions } from './radio-group'
export type { RadioProps } from './radio-group'
export type { SwitchProps } from './switch'
export type { TextInputProps } from './text-input'
export type { ButtonProps, ButtonColor, ButtonSize, ButtonVariant } from './button'
export type { ButtonGroupProps } from './button-group'
export type { AlertProps, AlertColor, AlertSize, AlertVariant } from './alert'
export type { BadgeProps, BadgeColor, BadgeSize, BadgeVariant } from './badge'
export type { TagProps, TagColor, TagSize, TagVariant } from './tag'
export type { DialogProps } from './dialog'
export type { IconProps, IconSize, IconColor, IconDefinition, IconRegistryData } from './icon'
export type { IconButtonProps, IconButtonVariant, IconButtonSize } from './icon-button'
export type { DividerProps } from './divider'
export type { CardProps, CardVariant, CardColor } from './card'
export type { NavbarProps, NavbarColor, NavbarAppearance } from './navbar'
export type { DetailProps, DetailVariant, DetailColor } from './detail'
