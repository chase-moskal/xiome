
import {Rando} from "../../../toolbox/get-rando.js"
import {generateAccount} from "./generate-account.js"
import {find} from "../../../toolbox/dbby/dbby-helpers.js"

import {CoreTables} from "../core-types.js"

export async function assertEmailAccount({rando, email, tables}: {
			rando: Rando
			email: string
			tables: CoreTables
		}) {
	const accountViaEmail = await tables.accountViaEmail.assert({
		...find({email}),
		make: async function makeNewAccountViaEmail() {
			const account = generateAccount(rando)
			await tables.account.create(account)
			return {
				email,
				userId: account.userId,
			}
		},
	})
	return {userId: accountViaEmail.userId}
}
