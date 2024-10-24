import type { Pattern } from '../../types.ts'
import hermitepoly from '@stdlib/math-base-tools-hermitepoly'

/**
 * Generate a pattern from the Hermite-Gauss kinoform.
 * @see https://doi.org/10.1117/12.2187325
 *
 * @param p - Coefficient of the Hermite-Gauss polynomial for `x` coordinate.
 * @param q - Coefficient of the Hermite-Gauss polynomial for `y` coordinate.
 * @param w0 - Natural pulsation of the laser.
 * @returns Pattern derived from the Hermite-Gauss kinoform.
 *
 * @example Usage
 * ```ts
 * import { Grating } from '@-/core'
 *
 * const w0 = 2 * Math.PI * 3e8 / 635e-9 // red laser of 635nm
 * const hgPattern = hermiteGaussKinoform(5, 3, w0)
 *
 * const hgGrating = Grating.fromPattern(256, 256, hgPattern) // screen of 256 x 256
 * ```
 */
export function hermiteGaussKinoform(
	p: number,
	q: number,
	w0: number,
): Pattern {
	const hermiteP = hermitepoly.factory(p)
	const hermiteQ = hermitepoly.factory(q)

	const prefactor = Math.SQRT2 / w0
	const firstExp = Math.exp(-1 / w0 ** 2)

	return (x, y) =>
		hermiteP(prefactor * x) *
		hermiteQ(prefactor * y) *
		firstExp *
		Math.exp(x ** 2 + y ** 2)
}
