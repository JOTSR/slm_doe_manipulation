import type { Pattern } from '../../types.ts'

export type PatternTransform = (
	x: number,
	y: number,
) => { x: number; y: number }

export class PatternTransformer {
	#transforms: PatternTransform[] = []

	translate(dx: number, dy: number): this {
		this.#transforms.push((x: number, y: number) => ({ x: x + dx, y: y + dy }))
		return this
	}

	rotate(angle: number): this {
		const cos = Math.cos(angle)
		const sin = Math.sin(angle)

		this.#transforms.push((x: number, y: number) => ({
			x: x * cos - y * sin,
			y: x * sin + y * cos,
		}))
		return this
	}

	scale(scaleX: number, scaleY: number): this {
		this.#transforms.push((x: number, y: number) => ({
			x: x / scaleX,
			y: y / scaleY,
		}))
		return this
	}

	custom(transformFn: PatternTransform): this {
		this.#transforms.push(transformFn)
		return this
	}

	/**
	 * Current transformed pattern.
	 */
	transform<T extends Pattern>(pattern: T): T {
		return this.#transforms.reduce(
			(currentPattern: T, transform: PatternTransform) => {
				return ((x_: number, y_: number) => {
					const { x, y } = transform(x_, y_)
					return currentPattern(x, y)
				}) as T
			},
			pattern,
		)
	}
}
