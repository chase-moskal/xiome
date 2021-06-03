
import {number, branch, notDefined, Validator} from "../../../../../toolbox/darkvalley.js"

export const validateTimeframe: Validator<undefined | number> = branch<undefined | number>(
	notDefined(),
	number(),
)
