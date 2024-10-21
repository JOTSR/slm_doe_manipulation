import type { Pattern, Pixel } from '../types.ts'
import {
	assertEquals,
	assertIsBetween,
	assertIsPositiveInteger,
} from './asserts.ts'

/**
 * Abstraction of a grating.
 * Provides many helpers to manipulate grating.
 *
 * @exmaple Usage
 * ```ts
 * const linearGrating = Grating.fromPattern(256, 256, (x, y) => x + y)
 * const blankGrating = new Grating(256, 256)
 *
 * console.assert(blankGrating.size.width === 256)
 * console.assert(linearGrating.getPixelMono(20, 50) === 20 + 50)
 *
 * const composedGrating = linearGrating.add(blankGrating)
 * ```
 */
export class Grating<Width extends number, Height extends number> {
	/**
	 * Construct a new grating from an ImageData (eg: from a canvas).
	 *
	 * @param width - Screen/Grating width.
	 * @param height - Screen/Grating height.
	 * @param img - Source image to draw.
	 * @returns newly constructed Grating corresponding to the input image.
	 */
	static fromImageData<Width extends number, Height extends number>(
		width: Width,
		height: Height,
		img: ImageData,
	): Grating<Width, Height> {
		assertEquals(img.width, width, { name: 'img.width' })
		assertEquals(img.height, height, { name: 'img.height' })

		const grating = new Grating(width, height)
		grating.#rawPixels = new Uint8Array(img.data)
		return grating
	}

	/**
	 * Construct a new grating already filled with a custom pattern.
	 *
	 * @param width - Screen/Grating width.
	 * @param height - Screen/Grating height.
	 * @param pattern - Pattern to draw.
	 * @returns newly constructed Grating corresponding to the pattern.
	 */
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

	/**
	 * Construct a blank grating.
	 *
	 * @param width - Screen/Grating width.
	 * @param height - Screen/Grating height.
	 */
	constructor(width: Width, height: Height) {
		assertIsPositiveInteger(width, { name: 'grating_width' })
		assertIsPositiveInteger(height, { name: 'grating_height' })

		this.#rawPixels = new Uint8Array(width * height * 4)
		this.#width = width
		this.#height = height
	}

	/**
	 * Access to the raw pixel buffer of the grating for better performance computations.
	 *
	 * @return __rgba__ buffer of length `Grating.size.width * Grating.size.heigth * 4`
	 */
	get rawPixels(): Uint8Array {
		return this.#rawPixels
	}

	/**
	 * Get a list of __rgba__ pixels with their coordinates.
	 *
	 * @returns pixels with their associated coordinates.
	 */
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

	/**
	 * Get the size of the Grating.
	 */
	get size(): { width: Width; height: Height } {
		return {
			width: this.#width,
			height: this.#height,
		}
	}

	/**
	 * Get a specific pixel from its coordinates.
	 *
	 * @returns pixel at (x, y).
	 */
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

	/**
	 * Set a specific pixel from its coordinates.
	 */
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

	/**
	 * Get a specific pixel from its coordinates as monochromatic (luminance) value.
	 *
	 * @returns monochromtaic pixel at (x, y).
	 */
	getPixelMono(x: number, y: number): number {
		const { r, b, g, alpha } = this.getPixel(x, y)
		if (alpha !== 255) {
			new RangeError('mono only available if pixel_alpha is 255')
		}
		if (r === g && g === b) return r
		// for coefficients see https://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
		return Math.round(0.2126 * r + 0.7152 * g + 0.0722 * g)
	}

	/**
	 * Set a specific pixel from its coordinates as monochromatic (luminance) value.
	 */
	setPixelMono(x: number, y: number, brightness: number): void {
		this.setPixel(x, y, {
			r: brightness,
			g: brightness,
			b: brightness,
			alpha: 255,
		})
	}

	/**
	 * Get the bitmap image corresponding the the Grating as an `ImageData`.
	 */
	get image(): ImageData {
		return new ImageData(
			Uint8ClampedArray.from(this.#rawPixels),
			this.#width,
			this.#height,
		)
	}

	/**
	 * Add to grating and return a new grating resulted from the pixel per pixel addition modulo 256.
	 * Source gratings are left intact.
	 */
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

	/**
	 * Add to current grating and return a new grating resulted from the pixel per pixel addition modulo 256.
	 * Source gratings are left intact.
	 */
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

	/**
	 * Multiply current grating and return a new grating resulted from the pixel per pixel multiplication modulo 256.
	 * Source gratings are left intact.
	 */
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

	/**
	 * Divide current grating and return a new grating resulted from the pixel per pixel division modulo 256.
	 * Source gratings are left intact.
	 */
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

	/**
	 * Get a new Grating where each pixel is the opposite of the source (255 - pixel_component).
	 */
	oppose(): Grating<Width, Height> {
		return this.mapRawPixels((value) => 255 - value)
	}

	/**
	 * Get a new Grating where each pixel is the invert of the source (255 / pixel_component) % 256.
	 */
	invert(): Grating<Width, Height> {
		return this.mapRawPixels((value) => 255 / value)
	}

	/**
	 * Clone the current Grating and return a new Grating with same size and same pixels.
	 */
	clone(): Grating<Width, Height> {
		const clone = new Grating(this.size.width, this.size.height)
		clone.#rawPixels = this.#rawPixels.slice()
		return clone
	}

	/**
	 * Clone the current Grating but replace each pixel (as u8 number) with the mapping callback.
	 */
	mapRawPixels(
		mapFn: (value: number, index: number, array: Uint8Array) => number,
	): Grating<Width, Height> {
		const clone = new Grating(this.size.width, this.size.height)
		clone.#rawPixels = this.#rawPixels.map(mapFn)
		return clone
	}

	/**
	 * Clone the current Grating but replace each pixel as (rgba value with coordinates) with the mapping callback.
	 */
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
