import type { Pattern } from '../../types.ts'

/**
 * Provide a pattern that draw a b&w circle.
 *
 * @param radius - Radius of the circle.
 * @param offsetX - Vertical origin.
 * @param offsetY - Horizontal origin.
 *
 * @example Usage
 * ```ts
 * const screenOrigin = { x: 255, y: 255 }
 * const smallBall = circle(
 * 	25,
 * 	screenOrigin.x,
 * 	screenOrigin.y,
 * )
 * ```
 */
export function circle(
	radius: number,
	offsetX: number,
	offsetY: number,
): Pattern {
	return (x, y) => 255 * Number(Math.hypot(x - offsetX, y - offsetY) > radius)
}

/**
 * Provide a pattern that draw a b&w rectangle.
 *
 * @param xMin - Rectangle vertical origin.
 * @param xMax - Rectangle vertical end.
 * @param yMin - Rectangle horizontal origin.
 * @param yMax - Rectangle horizontal end.
 * @param [invert=false] - Invert rectangle inside and outside.
 *
 * @example Usage
 * ```ts
 * const screenOrigin = { x: 255, y: 255 }
 * const smallBox = rect(
 * 	screenOrigin.x - 25,
 * 	screenOrigin.x + 25,
 * 	screenOrigin.y - 25,
 * 	screenOrigin.y + 25,
 * )
 * ```
 */
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

/**
 * Provide a pattern of uniformly distributed random pixels.
 *
 * @param [min=0] - Minimum random value.
 * @param [max=255] - Maximum random value.
 * @return Pattern filled with random values.
 *
 * @example Usage
 * ```ts
 * const grayishPattern = random()
 * ```
 */
export function random(min = 0, max = 255): Pattern {
	return () => (max - min) * Math.random() + min
}
