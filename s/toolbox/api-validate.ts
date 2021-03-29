
import {ApiError} from "renraku/x/api/api-error.js"

export function apiProblems(problems: string[]) {
	if (problems.length)
		throw new ApiError(400, problems.join("; "))
}
