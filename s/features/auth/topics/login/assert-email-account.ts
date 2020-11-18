
import {CoreTables} from "../../auth-types.js"
import {Rando} from "../../../../toolbox/get-rando.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"

import {generateAccountRow} from "./generate-account-row.js"

export async function assertEmailAccount({rando, email, tables}: {
			rando: Rando
			email: string
			tables: CoreTables
		}) {

	const accountViaEmail = await tables.accountViaEmail.assert({
		...find({email}),
		make: async function makeNewAccountViaEmail() {
			const account = generateAccountRow({rando})
			await tables.account.create(account)
			return {
				email,
				userId: account.userId,
			}
		},
	})

	return {userId: accountViaEmail.userId}
}
