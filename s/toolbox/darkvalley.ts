
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

export function one<xValue>(
		...conditions: Condition<xValue>[]
	): Condition<xValue> {
	return value => {
		let problems: string[] = []
		for (const condition of conditions) {
			problems = condition(value)
			if (problems.length > 0)
				break
		}
		return problems
	}
}

export function depend<xValue>(
		first: Condition<xValue>,
		...conditions: Condition<xValue>[]
	): Condition<xValue> {
	return value => {
		const problems = first(value)
		if (problems.length === 0) {
			for (const condition of conditions) {
				for (const problem of condition(value))
					problems.push(problem)
			}
		}
		return problems
	}
}

export function array<xValue>(
		...conditions: Condition<xValue>[]
	): Condition<xValue[]> {
	return arr => {
		if (!Array.isArray(arr)) return ["must be array"]
		const validate = validator<xValue>(...conditions)
		const problems: string[] = []
		arr.forEach((item, index) => {
			for (const problem of validate(item))
				problems.push(`(${index + 1}) ${problem}`)
		})
		return problems
	}
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
	/^https?:\/\/[a-zA-Z\.\d]+(?:|:\d+)$/i.test(value)
		? []
		: ["invalid origin"]

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const email = (): Condition<string> => value =>
	emailRegex.test(value)
		? []
		: ["invalid email"]

// const labelValidator = validator<string>(string(), minLength(1), maxLength(50), notWhitespace())
// const problems = labelValidator("hello")
// const problems2 = validator<string[]>(array(string()))
