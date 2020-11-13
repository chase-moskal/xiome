
import {AccountRow} from "../core-types.js"
import {Rando} from "../../../toolbox/get-rando.js"

export function generateAccount(rando: Rando): AccountRow {
	return {
		userId: rando.randomId(),
		created: Date.now(),
	}
}
