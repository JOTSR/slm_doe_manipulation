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

/**
 * Compare two numbers and throw an error if there is no equality.
 *
 * valueA - First number to test.
 * valueB - Second number to test.
 * options - Name of the tested variable in the error message.
 *
 * @throws {RangeError} Number must be equals.
 *
 * @example Usage
 * ```ts
 * assertEquals(0.3, 0.1 + 0.2) //ok
 * try {
 * 	const myConstant = 1
 * 	assertEquals(myConstant, 2, { name: 'myConstant' })
 * } catch (e) {
 * 	console.error(e)
 * }
 * ```
 */
export function assertEquals(
	valueA: number,
	valueB: number,
	{ name }: { name: string } = { name: 'value' },
): void {
	if (valueA !== valueB) {
		throw new RangeError(`"${name}": ${valueA} must be equals to ${valueB}`)
	}
}
