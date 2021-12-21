
import * as renraku from "renraku"

export function apiProblems(problems: string[]) {
	if (problems.length)
		throw new renraku.ApiError(400, problems.join("; "))
}
