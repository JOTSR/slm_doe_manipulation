import type { Pattern } from '../types.ts'

export function circle(
	ceil: number,
	offsetX: number,
	offsetY: number,
): Pattern {
	return (x, y) => 255 * Number(Math.hypot(x - offsetX, y - offsetY) > ceil)
}

export function rect(
	xMin: number,
	xMax: number,
	yMin: number,
	yMax: number,
	invert = false,
): Pattern {
	if (invert) {
		return (x, y) => 255 * Number(x > xMin && x < xMax && y > yMin && y < yMax)
	}

	return (x, y) => 255 * Number(!(x > xMin && x < xMax && y > yMin && y < yMax))
}

export function random(min = 0, max = 255): Pattern {
	return () => (max - min) * Math.random() + min
}
