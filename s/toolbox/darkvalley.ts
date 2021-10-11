
export type Validator<xValue> = (value: xValue) => string[]

export function validator<xValue>(
		...conditions: Validator<xValue>[]
	): Validator<xValue> {
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

export function multi<xValue>(...conditions: Validator<xValue>[]): Validator<xValue> {
	return value => {
		const problems: string[] = []
		for (const condition of conditions) {
			for (const problem of condition(value))
				problems.push(problem)
		}
		return problems
	}
}

export function schema<xObject extends {}>(schematic: {
		[P in keyof xObject]: Validator<xObject[P]>
	}): Validator<xObject> {
	const schematicKeys = Object.keys(schematic)
	return object => (
		Object.entries(object).flatMap(
			([key, value]) =>
				schematicKeys.includes(key)
					? (<Validator<any>>schematic[key])(value)
						.map(problem => `"${key}": ${problem}`)
					: [`"${key} not in schema"`]
		)
	)
}

export function branch<xValue>(...conditions: Validator<xValue>[]): Validator<xValue> {
	return value => {
		const results = conditions.map(condition => condition(value))
		let anySuccess = false
		for (const problems of results)
			if (problems.length === 0)
				anySuccess = true
		return anySuccess
			? []
			: results.flat()
				.map((problem, index) => index > 0 ? `or, ${problem}` : problem)
	}
}

export function depend<xValue>(
		first: Validator<xValue>,
		...conditions: Validator<xValue>[]
	): Validator<xValue> {
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

export function each<xValue>(
		...conditions: Validator<xValue>[]
	): Validator<xValue[]> {
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

export const is = <X>(x: X): Validator<X> => value =>
	value === x
		? []
		: ["wrong value"]

export const defined = (): Validator<any> => value =>
	(value === undefined || value === null)
		? ["must be defined (not undefined or null)"]
		: []

export const notDefined = (): Validator<undefined> => value =>
	(value !== undefined && value !== null)
		? ["must be undefined or null"]
		: []

export const string = (): Validator<string> => value =>
	typeof value !== "string"
		? ["must be a string"]
		: []

export const number = (): Validator<number> => value =>
	typeof value !== "number"
		? ["must be a number"]
		: []

export const boolean = (): Validator<boolean> => value =>
	typeof value !== "boolean"
		? ["must be a boolean"]
		: []

export const min = (threshold: number): Validator<number> => value =>
	value < threshold
		? ["too small"]
		: []

export const max = (threshold: number): Validator<number> => value =>
	value > threshold
		? ["too big"]
		: []

export const array = (): Validator<any[]> => value =>
	Array.isArray(value)
		? []
		: ["must be an array"]

export const length = (len: number): Validator<{length: number}> => value =>
	value.length !== len
		? [`length must be ${len}`]
		: []

export const minLength = (min: number): Validator<{length: number}> => value =>
	value.length < min
		? ["too small"]
		: []

export const maxLength = (max: number): Validator<{length: number}> => value =>
	value.length > max
		? ["too big"]
		: []

export const notWhitespace = (): Validator<string> => value =>
	value.length > 0 && value.trim().length === 0
		? ["can't be all whitespace"]
		: []

export const zeroWhitespace = (): Validator<string> => value =>
	/\s/.test(value)
		? ["must not have any spaces"]
		: []

export const url = (): Validator<string> => value => {
	try {
		void new URL(value)
		return []
	}
	catch (error) {
		return ["invalid url"]
	}
}

export const localhost = (): Validator<string> => value => {
	return /^https?:\/\/(127\.0\.0\.1|localhost)(|:\d{1,5})(|\/\S*)$/i.test(value)
		? []
		: ["must be a localhost address"]
}

export const https = (): Validator<string> => value => {
	return /^https:\/\//i.test(value)
		? []
		: ["must be secure, starting with 'https'"]
}

export const origin = (): Validator<string> => value =>
	/^https?:\/\/[a-zA-Z\.\d-]+(?:|:\d+)$/i.test(value)
		? []
		: ["invalid origin"]

export const regex = (r: RegExp, problem: string = "invalid string"): Validator<string> => value =>
	r.test(value)
		? []
		: [problem]

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const email = (): Validator<string> => value =>
	emailRegex.test(value)
		? []
		: ["invalid email"]

// const labelValidator = validator<string>(string(), minLength(1), maxLength(50), notWhitespace())
// const problems = labelValidator("hello")
// const problems2 = validator<string[]>(array(string()))
