import type { Pattern, Pixel } from '../types.ts'
import {
	assertEquals,
	assertIsBetween,
	assertIsPositiveInteger,
} from './asserts.ts'

export class Grating<Width extends number, Height extends number> {
	static fromImageData<Width extends number, Height extends number>(
		img: ImageData,
		width: Width,
		height: Height,
	): Grating<Width, Height> {
		assertEquals(img.width, width, { name: 'img.width' })
		assertEquals(img.height, height, { name: 'img.height' })

		const grating = new Grating<Width, Height>(width, height)
		grating.#rawPixels = new Uint8Array(img.data)
		return grating
	}

	static fromPattern<Width extends number, Height extends number>(
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

	#rawPixels: Uint8Array
	#width: Width
	#height: Height

	constructor(width: Width, height: Height) {
		assertIsPositiveInteger(width, { name: 'grating_width' })
		assertIsPositiveInteger(height, { name: 'grating_height' })

		this.#rawPixels = new Uint8Array(width * height * 4)
		this.#width = width
		this.#height = height
	}

	get rawPixels(): Uint8Array {
		return this.#rawPixels
	}

	get pixels(): { x: number; y: number; pixel: Pixel }[] {
		const pixels: { x: number; y: number; pixel: Pixel }[] = []

		for (let index = 0; index < this.#rawPixels.length; index += 4) {
			pixels.push({
				x: Math.trunc(index / 4) % (this.#width * 4),
				y: Math.trunc(index / (this.#width * 4)),
				pixel: {
					r: this.#rawPixels[index],
					g: this.#rawPixels[index + 1],
					b: this.#rawPixels[index + 2],
					alpha: this.#rawPixels[index + 3],
				},
			})
		}

		return pixels
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
			r: this.#rawPixels[index],
			g: this.#rawPixels[index + 1],
			b: this.#rawPixels[index + 2],
			alpha: this.#rawPixels[index + 3],
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

		this.#rawPixels[index] = r
		this.#rawPixels[index + 1] = g
		this.#rawPixels[index + 2] = b
		this.#rawPixels[index + 3] = alpha
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
		return new ImageData(
			Uint8ClampedArray.from(this.#rawPixels),
			this.#width,
			this.#height,
		)
	}

	// operations
	add(
		...gratings: Grating<Width, Height>[]
	): Grating<Width, Height> {
		const result = this.clone()
		const pixels = result.rawPixels

		for (const grating of gratings) {
			const addPixels = grating.rawPixels
			for (let i = 0; i < pixels.length; i++) {
				pixels[i] += addPixels[i]
			}
		}

		return result
	}

	substract(
		...gratings: Grating<Width, Height>[]
	): Grating<Width, Height> {
		const result = this.clone()
		const pixels = result.rawPixels

		for (const grating of gratings) {
			const addPixels = grating.rawPixels
			for (let i = 0; i < pixels.length; i++) {
				pixels[i] -= addPixels[i]
			}
		}

		return result
	}

	multiply(
		...gratings: Grating<Width, Height>[]
	): Grating<Width, Height> {
		const result = this.clone()
		const pixels = result.rawPixels

		for (const grating of gratings) {
			const addPixels = grating.rawPixels
			for (let i = 0; i < pixels.length; i++) {
				pixels[i] += addPixels[i]
			}
		}

		return result
	}

	divide(
		...gratings: Grating<Width, Height>[]
	): Grating<Width, Height> {
		const result = this.clone()
		const pixels = result.rawPixels

		for (const grating of gratings) {
			const addPixels = grating.rawPixels
			for (let i = 0; i < pixels.length; i++) {
				pixels[i] += addPixels[i]
			}
		}

		return result
	}

	//transformations
	oppose(): Grating<Width, Height> {
		return this.mapRawPixels((value) => 255 - value)
	}

	invert(): Grating<Width, Height> {
		return this.mapRawPixels((value) => 255 / value)
	}

	//manipulations
	clone(): Grating<Width, Height> {
		const clone = new Grating(this.size.width, this.size.height)
		clone.#rawPixels = this.#rawPixels.slice()
		return clone
	}

	mapRawPixels(
		mapFn: (value: number, index: number, array: Uint8Array) => number,
	): Grating<Width, Height> {
		const clone = new Grating(this.size.width, this.size.height)
		clone.#rawPixels = this.#rawPixels.map(mapFn)
		return clone
	}

	mapPixels(
		mapFn: (
			value: { x: number; y: number; pixel: Pixel },
			index: number,
			array: { x: number; y: number; pixel: Pixel }[],
		) => { x: number; y: number; pixel: Pixel },
	): Grating<Width, Height> {
		const clone = new Grating(this.size.width, this.size.height)
		this.pixels.forEach((value, index, array) => {
			const mapped = mapFn(value, index, array)
			clone.setPixel(mapped.x, mapped.y, mapped.pixel)
		})
		return clone
	}
}
