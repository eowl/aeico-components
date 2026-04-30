export type IconSize = '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number

export type IconColor = 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'

export interface IconDefinition {
  path: string
  viewBox?: string
  stroke?: boolean
  strokeWidth?: number
}

export const defaultViewBox = '0 0 24 24'

export type IconRegistryData = Record<string, string | IconDefinition>
