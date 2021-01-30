
export type Condition<xValue> = (value: xValue) => string[]

export function validator<xValue>(...conditions: Condition<xValue>[]): Condition<xValue> {
	return value => {
		const problems: string[] = []
		for (const condition of conditions) {
			for (const problem of condition(value))
				problems.push(problem)
		}
		return problems
	}
}

export const array = <xValue>(
		...conditions: Condition<xValue>[]
	): Condition<xValue[]> => arr => {
	if (!Array.isArray(arr)) return ["must be array"]
	const validate = validator<xValue>(...conditions)
	const problems: string[] = []
	for (const item of arr) {
		for (const problem of validate(item))
			problems.push(problem)
	}
	return problems
}

export const string = (): Condition<string> => value =>
	typeof value !== "string"
		? ["must be a string"]
		: []

export const number = (): Condition<number> => value =>
	typeof value !== "number"
		? ["must be a number"]
		: []

export const minLength = (min: number): Condition<{length: number}> => value =>
	value.length < min
		? ["too small"]
		: []

export const maxLength = (max: number): Condition<{length: number}> => value =>
	value.length > max
		? ["too big"]
		: []

export const notWhitespace = (): Condition<string> => value =>
	value.trim().length === 0
		? ["can't be all whitespace"]
		: []

export const url = (): Condition<string> => value => {
	try {
		void new URL(value)
		return []
	}
	catch (error) {
		return ["invalid url"]
	}
}

export const origin = (): Condition<string> => value =>
	/^https?:\/\/\s+(?:|:\d+)$/i.test(value)
		? []
		: ["invalid origin"]

// const labelValidator = validator<string>(string(), minLength(1), maxLength(50), notWhitespace())
// const problems = labelValidator("hello")
// const problems2 = validator<string[]>(array(string()))
