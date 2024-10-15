import type { Pattern } from '../types.ts'
import { Grating } from './grating.ts'

export function patternGrating<Width extends number, Height extends number>(
	width: Width,
	height: Height,
	pattern: Pattern,
): Grating<Width, Height> {
	const grating = new Grating(width, height)

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const value = pattern(x, y)

			if (typeof value === 'number') {
				grating.setPixelMono(x, y, value)
			} else {
				grating.setPixel(x, y, value)
			}
		}
	}

	return grating
}
