
import {objectMap} from "@chasemoskal/snapstate"

import {validateId} from "../../../../common/validators/validate-id.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"

/**
 * take a group of functions which all accept a tierId argument,
 * and automate the validation of that argument,
 * thus returning a group of augmented functions that will perform the validation.
 */
export function automateArgumentValidationForTierId<F extends {
		[key: string]: (tierId: string) => Promise<any>
	}>(funcs: F) {

	return <F>objectMap(funcs, fun => async(rawTierId: string) => {
		const tierId = runValidation(rawTierId, validateId)
		return fun(tierId)
	})
}
