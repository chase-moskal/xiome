
import {AuthTables} from "../../auth-types.js"
import {Rando} from "../../../../toolbox/get-rando.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"

import {generateAccountRow} from "./generate-account-row.js"

export async function assertEmailAccount({rando, email, tables}: {
			rando: Rando
			email: string
			tables: AuthTables
		}) {

	const {userId} = await tables.accountViaEmail.assert({
		...find({email}),
		make: async function makeNewAccountViaEmail() {
			const account = generateAccountRow({rando})
			const {userId} = account
			await tables.account.create(account)
			return {email, userId}
		},
	})

	return {userId}
}
