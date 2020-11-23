
import {Rando} from "../../../../toolbox/get-rando.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {AuthTables, PlatformConfig} from "../../auth-types.js"

import {generateAccountRow} from "./generate-account-row.js"
import {applyPermissionsForNewcomer} from "./permissions/apply-permissions-for-newcomer.js"
import {applyPermissionsForTechnician} from "./permissions/apply-permissions-for-technician.js"

export async function assertEmailAccount({rando, email, tables, technician}: {
			rando: Rando
			email: string
			tables: AuthTables
			technician: PlatformConfig["platform"]["technician"]
		}) {

	const {userId} = await tables.accountViaEmail.assert({
		...find({email}),
		make: async function makeNewAccountViaEmail() {
			const isTechnician = rando.compare(email, technician.email)

			const account = generateAccountRow({rando})
			const {userId} = account
			await tables.account.create(account)

			if (isTechnician)
				await applyPermissionsForTechnician({tables, userId})
			else
				await applyPermissionsForNewcomer({tables, userId})

			return {email, userId}
		},
	})

	return {userId}
}
