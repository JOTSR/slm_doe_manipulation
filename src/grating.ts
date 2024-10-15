import type { Pixel } from '../types.ts'
import { assertIsBetween, assertIsPositiveInteger } from './asserts.ts'

export class Grating<Width extends number, Height extends number> {
	#pixels: Uint8ClampedArray
	#width: Width
	#height: Height

	constructor(width: Width, height: Height) {
		assertIsPositiveInteger(width, { name: 'grating_width' })
		assertIsPositiveInteger(height, { name: 'grating_height' })

		this.#pixels = new Uint8ClampedArray(width * height * 4)
		this.#width = width
		this.#height = height
	}

	get pixels(): Uint8ClampedArray {
		return this.#pixels
	}

	get size(): { width: Width; height: Height } {
		return {
			width: this.#width,
			height: this.#height,
		}
	}

	getPixel(x: number, y: number): Pixel {
		assertIsPositiveInteger(x, { name: 'pixel_x' })
		assertIsPositiveInteger(y, { name: 'pixel_y' })
		assertIsBetween(x, [0, this.#width], {
			name: 'pixel_x',
			exclusive: [false, true],
		})
		assertIsBetween(y, [0, this.#height], {
			name: 'pixel_y',
			exclusive: [false, true],
		})

		const index = 4 * (x + y * this.#width)

		return {
			r: this.#pixels[index],
			g: this.#pixels[index + 1],
			b: this.#pixels[index + 2],
			alpha: this.#pixels[index + 3],
		}
	}

	setPixel(x: number, y: number, { r, g, b, alpha }: Pixel): void {
		assertIsPositiveInteger(x, { name: 'pixel_x' })
		assertIsPositiveInteger(y, { name: 'pixel_y' })
		assertIsBetween(x, [0, this.#width], {
			name: 'pixel_x',
			exclusive: [false, true],
		})
		assertIsBetween(y, [0, this.#height], {
			name: 'pixel_y',
			exclusive: [false, true],
		})

		const index = 4 * (x + y * this.#width)

		this.#pixels[index] = r
		this.#pixels[index + 1] = g
		this.#pixels[index + 2] = b
		this.#pixels[index + 3] = alpha
	}

	getPixelMono(x: number, y: number): number {
		const { r, b, g, alpha } = this.getPixel(x, y)
		if (alpha !== 255) {
			new RangeError('mono only available if pixel_alpha is 255')
		}
		if (r === g && g === b) return r
		// for coefficients see https://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
		return Math.round(0.2126 * r + 0.7152 * g + 0.0722 * g)
	}

	setPixelMono(x: number, y: number, brightness: number): void {
		this.setPixel(x, y, {
			r: brightness,
			g: brightness,
			b: brightness,
			alpha: 255,
		})
	}

	get image(): ImageData {
		return new ImageData(this.#pixels, this.#width, this.#height)
	}
}
