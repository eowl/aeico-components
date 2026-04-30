export type SliderOptionValue = string | number

export type SliderOption = {
  label: string
  value: SliderOptionValue
}

export type SliderOptions = SliderOptionValue[] | SliderOption[]

export type NormalizedOption = {
  label: string
  value: string      // stored as string for consistency with this.value
  rangeValue: number // numeric value used by the range input
}

/**
 * A single mark on the slider track.
 * - `number` — mark at that numeric position, no label
 * - `{ value, label? }` — mark at `value` with optional label
 *
 * Marks are purely visual; they do NOT constrain snapping.
 * The slider still snaps according to `step` / `options`.
 * Marks outside [min, max] are silently ignored.
 */
export type MarkItem = number | { value: number; label?: string }

/**
 * The `marks` prop accepts:
 * - `true`  — auto-generate marks (at option positions, or min+max in free mode)
 * - `MarkItem[]` — custom marks at the given positions
 * - `false` / omitted — no marks
 */
export type SliderMarks = boolean | MarkItem[]
