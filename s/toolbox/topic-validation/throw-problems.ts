
import * as renraku from "renraku"

export function throwProblems(problems: string[]) {
	if (problems.length > 0)
		throw new renraku.ApiError(400, problems.join("; "))
}
