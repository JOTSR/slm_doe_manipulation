export type Pattern =
	| ((x: number, y: number) => number)
	| ((x: number, y: number) => Pixel)

export type Pixel = { r: number; g: number; b: number; alpha: number }
