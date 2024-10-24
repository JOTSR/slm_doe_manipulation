import { assertIsBetween, assertIsPositiveInteger } from './asserts.ts'
import { Grating } from './grating.ts'

/**
 * Blaze grating configuration.
 *
 * @property max - Max height of the grating between 0 and 255 (as 0 and 2π).
 * @property count - Number of vertical blades of the grating.
 * @property tilt - Trigonometric tilt angle to apply to the blaze in radian from vertical axis.
 *
 * @example Example
 * ```ts
 * const blaze = {
 * 	max: 255 // i.e 0-2π in phase space.
 * 	count: 25 // i.e approximatively 10px width on a 256 pixel width screen.
 * 	tilt: Math.PI / 2 // i.e 45deg blaze grating.
 * }
 * ```
 */
export type Blaze = {
	max: number
	count: number
	tilt: number
}

/**
 * Make a grating filled with a blaze diffraction pattern.
 *
 * @param width - Width of the display screen.
 * @param height - Height of the display screen.
 * @param blaze - Configuration of the pattern.
 * @returns Grating with the specified width and height filled with blaze pattern.
 *
 * @example Usage
 * ```ts
 * const grating = blazeGrating(256, 256, { count: 25, height: 255, tilt: 0 })
 * ```
 */
export function blazeGrating<Width extends number, Height extends number>(
	width: Width,
	height: Height,
	blaze: Blaze,
): Grating<Width, Height> {
	assertIsPositiveInteger(blaze.max, { name: 'blaze.max' })
	assertIsPositiveInteger(blaze.count, { name: 'blaze.count' })
	assertIsBetween(blaze.max, [0, 255], {
		name: 'blaze.count',
		exclusive: [false, false],
	})

	if (blaze.count > width) {
		throw new RangeError(
			`blaze count of ${blaze.count} can't fit in ${width} pixels width`,
		)
	}

	const grating = new Grating(width, height)

	// 0.5 and 2 to compense x and y blaze
	const slope = 0.5 * blaze.count * (blaze.max / 255)
	const clamp = 2 * width / blaze.count

	const cos = Math.cos(Math.PI / 4 - blaze.tilt)
	const sin = Math.sin(Math.PI / 4 - blaze.tilt)

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const x_ = x * cos - y * sin
			const y_ = x * sin + y * cos

			const brightnessX = slope * (x_ % clamp)
			const brightnessY = slope * (y_ % clamp)
			const brightness = brightnessX + brightnessY
			grating.setPixelMono(x, y, brightness)
		}
	}

	return grating
}
