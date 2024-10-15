import type { Pattern } from '../types.ts'
import { assertIsPositiveInteger } from './asserts.ts'

export function patternGrating(
	width: number,
	height: number,
	pattern: Pattern,
): Uint8ClampedArray {
	assertIsPositiveInteger(width, { name: 'image_width' })
	assertIsPositiveInteger(height, { name: 'image_height' })

	const pixels = new Uint8ClampedArray(width * height * 4)

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const i = (y * width + x) * 4
			const value = pattern(x, y)

			pixels[i] = value // red
			pixels[i + 1] = value // green
			pixels[i + 2] = value // blue
			pixels[i + 3] = 255 // alpha
		}
	}

	return pixels
}
