
import {Rando} from "../../../../toolbox/get-rando.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {AuthTables, PlatformConfig} from "../../auth-types.js"

import {generateAccountRow} from "./generate-account-row.js"

export async function assertEmailAccount({rando, tables, email, config}: {
			rando: Rando
			email: string
			tables: AuthTables
			config: PlatformConfig
		}) {

	const {userId} = await tables.accountViaEmail.assert({
		...find({email}),
		make: async function makeNewAccountViaEmail() {
			const isTechnician = rando.compare(email, config.platform.technician.email)
			const {roleId} = config.permissions.platform.roles.find(row => row.label === "technician")

			const account = generateAccountRow({rando})
			const {userId} = account

			const operationCreatesAccount = tables.account.create(account)
			const operationCreatesTechnicianUserRole = isTechnician
				? tables.userRole.create({userId, roleId})
				: Promise.resolve()

			await Promise.all([operationCreatesAccount, operationCreatesTechnicianUserRole])
			return {email, userId}
		},
	})

	return {userId}
}
