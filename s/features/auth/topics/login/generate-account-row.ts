
import {AccountRow} from "../../tables/types/rows/account-row.js"
import {Rando} from "../../../../toolbox/get-rando.js"

export function generateAccountRow({rando}: {rando: Rando}): AccountRow {
	return {
		id_user: rando.randomId(),
		created: Date.now(),
	}
}
