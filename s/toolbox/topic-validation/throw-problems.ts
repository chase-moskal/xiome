
import {ApiError} from "renraku/x/api/api-error.js"

export function throwProblems(problems: string[]) {
	if (problems.length > 0)
		throw new ApiError(400, problems.join("; "))
}
