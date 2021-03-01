
import {Profile} from "../../types/auth-types.js"

export const nicknameMax = 21
export const taglineMax = 32

export function validateProfile(profile: Profile): {
		problems: string[]
	} {

	let problems = []
	let fields = Object.entries(profile)

	function pluck<T extends keyof Profile>(prop: T): Profile[T] {
		const [,value] = fields.find(([key]) => key === prop) ?? []
		fields = fields.filter(([key]) => key !== prop)
		return value
	}

	function assert(condition: boolean, problem: string) {
		if (!condition) problems.push(problem)
		return condition
	}

	function assertString({label, subject, min, max}: {
			label: string
			subject: string
			min: number
			max: number
		}) {
		assert(typeof subject === "string", `${label} must be string`)
			&& assert(subject.length >= min, `${label} must be at least ${min} characters`)
			&& assert(subject.length <= max, `${label} must be ${max} characters or less`)
	}

	//
	// actual validations
	//

	// validate nickname
	{
		const label = "nickname"
		assertString({
			label,
			subject: pluck(label),
			min: 1,
			max: nicknameMax,
		})
	}

	// validate tagline
	{
		const label = "tagline"
		assertString({
			label,
			subject: pluck(label),
			min: 0,
			max: taglineMax,
		})
	}

	// validate avatar
	{
		const label = "avatar"
		assertString({
			label,
			subject: pluck(label),
			min: 0,
			max: 1024,
		})
	}

	// validate against excess data
	assert(fields.length === 0, "must have no excess profile data")

	return {problems}
}
