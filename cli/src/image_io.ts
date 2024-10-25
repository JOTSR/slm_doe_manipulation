import { createCanvas, loadImage } from '@gfx/canvas-wasm'

export async function readImageData(path: string): Promise<ImageData> {
	const image = await loadImage(path)
	const [width, height] = [image.width(), image.height()]

	// create new canvas context
	const canvas = createCanvas(width, height)
	const ctx = canvas.getContext('2d')

	// draw image on context and get image data (bitmap)
	ctx.drawImage(image, 0, 0)
	const fakeImageData = ctx.getImageData(0, 0, width, height)

	// cleanup ressources
	canvas.dispose()

	//@ts-expect-error path @gfx/canvas-wasm `ImageData` to add `colorSpace`
	fakeImageData.colorSpace = 'srgb'
	return fakeImageData as ImageData
}

export function writeImageData(
	path: string,
	imageData: ImageData,
): Promise<void> {
	const { width, height } = imageData

	// create new canvas context
	const canvas = createCanvas(width, height)
	const ctx = canvas.getContext('2d')

	// draw image data on context
	ctx.putImageData(imageData, 0, 0)

	// use png to support transparency and reduce artifacts
	const buffer = canvas.toBuffer('image/png')

	// cleanup ressources
	canvas.dispose()

	return Deno.writeFile(path, buffer)
}
