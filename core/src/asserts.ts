/**
 * Test if a value is a positive integer (u64).
 *
 * value - Number to test.
 * options - Name of the tested variable in the error message.
 *
 * @throws {RangeError} Number must be a positive interger.
 *
 * @example Usage
 * ```ts
 * assertIsPositiveInteger(3) //ok
 * try {
 * 	const myFloat = 1.2
 * 	assertIsPositiveInteger(myFloat, { name: 'myFloat' })
 * } catch {
 * 	//RangeError: "myFloat": 1.2 is not a positive interger
 * }
 * ```
 */
export function assertIsPositiveInteger(
	value: number,
	{ name }: { name: string } = { name: 'value' },
): void {
	if (value < 0 || !Number.isFinite(value)) {
		throw new RangeError(`"${name}: ${value}" is not a positive integer`)
	}
}

/**
 * Test is a value is included between to bounds.
 *
 * value - Value that must be inside bounds.
 * bounds - Specified bounds.
 * options - Name of the tested variable in the error message and bounds exlusive behaviour.
 *
 * @throws {RangeError} Number must be included in specied bounds.
 *
 * @example Usage
 * ```ts
 * assertIsBetween(0.3, [0.1, 0.3]) //ok
 * try {
 * 	assertIsBetween(0.3, [0.1, 0.3], { name: 'bounded', exclusive: [false, true] })
 * } catch {
 * 	//RangeError: "bounded": 0.3 must be >= 0.1 and < 0.3
 * }
 * ```
 */
export function assertIsBetween(
	value: number,
	bounds: [min: number, max: number],
	{ name, exclusive }: {
		name: string
		exclusive: [boolean, boolean]
	} = { name: 'value', exclusive: [false, false] },
): void {
	const leftBound = exclusive[0] ? value > bounds[0] : value >= bounds[0]
	const rightBound = exclusive[1] ? value < bounds[1] : value <= bounds[1]
	if (!(leftBound && rightBound)) {
		throw new RangeError(
			`"${name}: ${value}" must be ${exclusive[0] ? '>' : '>='} ${
				bounds[0]
			} and ${exclusive[1] ? '<' : '<='} ${bounds[1]}`,
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
 * } catch {
 * 	//RangeError: "myConstant": 1 must be equals to 2
 * }
 * ```
 */
export function assertEquals(
	valueA: number,
	valueB: number,
	{ name }: { name: string } = { name: 'value' },
): void {
	if (Math.abs(valueA - valueB) > Number.EPSILON) {
		throw new RangeError(`"${name}": ${valueA} must be equals to ${valueB}`)
	}
}
