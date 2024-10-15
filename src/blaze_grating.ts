export type Blaze = {
	max: number
	count: number
}

export function fillBlazeGrating(
	width: number,
	height: number,
	blaze: Blaze,
): Uint8ClampedArray {
	const pixels = new Uint8ClampedArray(width * height * 4)

	if (blaze.count > width) {
		throw new RangeError(
			`blaze count of ${blaze.count} can't fit in ${width} pixels width`,
		)
	}

	const slope = blaze.count * (blaze.max / 255)
	const clamp = width / blaze.count

	for (let i = 0; i < width * height * 4; i += 4) {
		const x = (i / 4) % width

		const brightness = slope * (x % clamp)
		pixels[i] = brightness //red
		pixels[i + 1] = brightness //blue
		pixels[i + 2] = brightness //blue
		pixels[i + 3] = 255 //alpha
	}

	return pixels
}
