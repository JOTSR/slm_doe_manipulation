import { blazeGrating, Grating } from '@-/core'
import { readImageData } from './image_io.ts'

export function buildImageLayer(
	width: number,
	height: number,
	{ image }: { image?: string[] },
): Promise<Grating<number, number>[]> {
	const gratings = image?.map(async (path) => {
		//image to fft
		const img = await readImageData(path)
		//TODO make fft
		return Grating.fromImageData(width, height, img)
	}) ?? []

	return Promise.all(gratings)
}

export function buildDoeLayer(
	width: number,
	height: number,
	{ doe }: { doe?: string[] },
): Promise<Grating<number, number>[]> {
	const gratings = doe?.map(async (path) => {
		const img = await readImageData(path)
		return Grating.fromImageData(width, height, img)
	}) ?? []

	return Promise.all(gratings)
}

export function buildBlazeLayer(
	width: number,
	height: number,
	{ blaze }: { blaze?: string[] },
): Grating<number, number>[] {
	const gratings = blaze?.map((args) => {
		const [count, max, tilt] = args.split(',').map((arg) =>
			Number.parseInt(arg)
		)

		return blazeGrating(width, height, { count, max, tilt })
	})

	return gratings ?? []
}

export function buildPatternLayer(
	width: number,
	height: number,
	{ pattern }: { pattern?: string[] },
): Grating<number, number>[] {
	// TODO support built-in patterns and arrow functions
	throw new Error('not implemented')
}
