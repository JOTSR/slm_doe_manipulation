import { ensureFile } from '@std/fs/ensure-file'
import { Grating } from '@-/core'
import {
	buildBlazeLayer,
	buildDoeLayer,
	buildImageLayer,
	buildPatternLayer,
} from './build_layers.ts'
import { writeImageData } from './image_io.ts'

type Layer = {
	image?: string[]
	doe?: string[]
	pattern?: string[]
	blaze?: string[]
}

export async function mainCommand(
	layers: Layer,
	width: number,
	height: number,
	output: string,
) {
	// Define source grating
	const grating = new Grating(width, height)

	// Get layers
	const images = await buildImageLayer(width, height, layers)
	const does = await buildDoeLayer(width, height, layers)
	const patterns = buildPatternLayer(width, height, layers)
	const blazes = buildBlazeLayer(width, height, layers)

	// Merge layers
	const result = grating.add(...images, ...does, ...patterns, ...blazes)

	// Write final image
	await ensureFile(output)
	await writeImageData(output, result.image)
}
