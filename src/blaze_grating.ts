import { assertIsBetween, assertIsPositiveInteger } from './asserts.ts'
import { Grating } from './grating.ts'

export type Blaze = {
	max: number
	count: number
}

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
