import type { Pattern } from '../../types.ts'
import hermitepoly from '@stdlib/math-base-tools-hermitepoly'

/**
 * Generate a pattern from the Hermite-Gauss kinoform.
 * @see https://doi.org/10.1117/12.2187325
 *
 * @param p - Coefficient of the Hermite-Gauss polynomial for `x` coordinate.
 * @param q - Coefficient of the Hermite-Gauss polynomial for `y` coordinate.
 * @param waist - Beam waist on the camera PIXELs.
 * @returns Pattern derived from the Hermite-Gauss kinoform.
 *
 * @example Usage
 * ```ts
 * import { Grating } from '@-/core'
 *
 * const waist = 41 // with a beam size of 41px on the camera
 * const hgPattern = hermiteGaussKinoform(4, 4, waist)
 *
 * const hgGrating = Grating.fromPattern(256, 256, hgPattern) // screen of 256 x 256
 * ```
 */
export function hermiteGaussKinoform(
	p: number,
	q: number,
	waist: number,
): Pattern {
	const hermiteP = hermitepoly.factory(p)
	const hermiteQ = hermitepoly.factory(q)

	const prefactor = Math.SQRT2 / waist
	const waist2 = waist ** 2

	return (x, y) =>
		hermiteP(prefactor * x) *
		hermiteQ(prefactor * y) *
		Math.exp(-(x ** 2 + y ** 2) / waist2)
}
