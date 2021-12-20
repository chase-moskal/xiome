
import {RenrakuError} from "renraku"

export function throwProblems(problems: string[]) {
	if (problems.length > 0)
		throw new RenrakuError(400, problems.join("; "))
}
