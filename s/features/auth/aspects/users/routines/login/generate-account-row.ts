
import {AccountRow} from "../../types/user-tables.js"
import {Rando} from "../../../../../../toolbox/get-rando.js"

export function generateAccountRow({rando}: {rando: Rando}): AccountRow {
	return {
		userId: rando.randomId(),
		created: Date.now(),
	}
}
