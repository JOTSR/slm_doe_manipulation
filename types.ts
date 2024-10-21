/**
 * A Pattern is a function that takes pixel coordinates and return luminance or color value.
 *
 * @example Example
 * ```ts
 * const randomMonochromePattern: Pattern = (x, y) => Math.random()
 * const linearMonochromePattern: Pattern = (x, y) => x + y
 * ```
 */
export type Pattern =
	| ((x: number, y: number) => number)
	| ((x: number, y: number) => Pixel)

/**
 * A Pixel is a representation of the color value of a screen pixel.
 *
 * @example Example
 * ```ts
 * const red: Pixel = { r: 255, g: 0, b: 0, alpha: 255 }
 * const semiCyan: Pixel = { r: 0, g: 255, b: 255, alpha: 127 }
 * ```
 */
export type Pixel = { r: number; g: number; b: number; alpha: number }
