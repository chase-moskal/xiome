
import {RenrakuError} from "renraku"

export function apiProblems(problems: string[]) {
	if (problems.length)
		throw new RenrakuError(400, problems.join("; "))
}
