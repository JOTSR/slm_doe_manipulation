export function assertIsPositiveInteger(
	value: number,
	{ name }: { name: string } = { name: 'value' },
): void {
	if (value < 0 || !Number.isFinite(value)) {
		throw new RangeError(`"${name}: ${value}" is not a positive integer`)
	}
}

export function assertIsBetween(
	value: number,
	range: [min: number, max: number],
	{ name, exclusive }: {
		name: string
		exclusive: [boolean, boolean]
	} = { name: 'value', exclusive: [false, false] },
): void {
	const leftBound = exclusive[0] ? value <= range[0] : value < range[0]
	const rightBound = exclusive[1] ? value <= range[1] : value < range[1]
	if (leftBound || rightBound) {
		throw new RangeError(
			`"${name}: ${value}" must be ${exclusive[0] ? '>' : '>='} ${
				range[0]
			} and ${exclusive[1] ? '<' : '<='} ${range[1]}`,
		)
	}
}
