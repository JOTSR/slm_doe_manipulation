import { assertIsBetween, assertIsPositiveInteger } from './asserts.ts'
import { Grating } from './grating.ts'

/**
 * Blaze grating configuration.
 *
 * @property max - Max height of the grating between 0 and 255 (as 0 and 2π).
 * @property count - Number of vertical blades of the grating.
 *
 * @example Example
 * ```ts
 * const blaze = {
 * 	max: 255 // i.e 0-2π in phase space.
 * 	count: 25 // i.e approximatively 10px width on a 256 pixel width screen.
 * }
 * ```
 */
export type Blaze = {
	max: number
	count: number
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
 * const grating = blazeGrating(256, 256, { count: 25, height: 255 })
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
	const pixels = grating.rawPixels

	const slope = blaze.count * (blaze.max / 255)
	const clamp = width / blaze.count

	for (let i = 0; i < width * height * 4; i += 4) {
		const x = (i / 4) % width

		const brightness = slope * (x % clamp)
		pixels[i] = brightness //red
		pixels[i + 1] = brightness //blue
		pixels[i + 2] = brightness //blue
		pixels[i + 3] = 255 //alpha
	}

	return grating
}
