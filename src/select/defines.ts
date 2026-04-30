export type SelectOptionValue = string | number

export type SelectOption = {
  label: string
  value: SelectOptionValue
}

export type SelectOptions = SelectOptionValue[] | SelectOption[]

export type SelectPosition = 'top' | 'bottom' | 'left' | 'right'

export type SelectMultiValue = SelectOptionValue[]