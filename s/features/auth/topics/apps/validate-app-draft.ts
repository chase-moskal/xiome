
import {check, array, createSchema, Builder, atLeast, not, moreThan, length, enUS, string, any, Schema} from "bueno"

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

	function commit(problem: string) {
		if (problem) problems.push(problem)
	}

	function validate(value: any, schema: Schema<any>) {
		commit(check(value, schema, enUS))
	}

	validate(appDraft.label, smallText)
	validate(appDraft.home, url)
	validate(appDraft.origins, any(length(atLeast(1)), array(url)))

	return problems
}
