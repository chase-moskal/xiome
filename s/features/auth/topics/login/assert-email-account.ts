
import {Rando} from "../../../../toolbox/get-rando.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {AuthTables, PlatformConfig} from "../../auth-types.js"

import {generateAccountRow} from "./generate-account-row.js"

export async function assertEmailAccount({rando, email, tables, technician}: {
			rando: Rando
			email: string
			tables: AuthTables
			technician: PlatformConfig["platform"]["technician"]
		}) {

	const {userId} = await tables.accountViaEmail.assert({
		...find({email}),
		make: async function makeNewAccountViaEmail() {
			const account = generateAccountRow({rando})
			const isTechnician = rando.compare(email, technician.email)
			await tables.account.create(account)
			if (isTechnician) await applyTechnicianPermissions({tables, userId: account.userId})
			return {
				email,
				userId: account.userId,
			}
		},
	})

	return {userId}
}

async function applyTechnicianPermissions({userId, tables}: {
			userId: string
			tables: AuthTables
		}) {
	throw new Error("TODO implement")
}
