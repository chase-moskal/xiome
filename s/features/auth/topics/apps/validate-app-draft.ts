
import {check, object, array, alphaNumeric, createSchema, Builder, atLeast, not, moreThan, length, enUS, string, any, between} from "bueno"
import {AppDraft} from "../../../../types.js"

export function validateAppDraft(appDraft: AppDraft) {
	const problems = []

	const smallText = string(length(atLeast(1), not(moreThan(50))))

	const url = string(length(not(moreThan(2000))), createSchema((value: string) => {
		let ok = false
		try {
			void new URL(value)
			ok = true
		} catch (e) {}
		return {
			validate: {
				ok,
				msg: (l: Builder) => l.mustBe("a valid url")
			},
		}
	}))

	const schema = object({
		label: smallText,
		home: url,
		origins: any(length(atLeast(1)), array(url)),
	})

	const error = check(appDraft, schema, enUS)
	if (error) problems.push(error)

	return problems
}
