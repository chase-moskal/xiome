
import {Rando} from "../../../../toolbox/get-rando.js"
import {AuthTables} from "../../tables/types/auth-tables.js"
import {generateAccountRow} from "./generate-account-row.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {PlatformConfig} from "../../../../assembly/backend/types/platform-config.js"
import {universalRoles} from "../../../../assembly/backend/permissions/standard/universal/universal-roles.js"

const technicianRoleId = universalRoles.technician.roleId

export async function assertEmailAccount({
			rando, email, tables, config,
		}: {
			rando: Rando
			email: string
			tables: AuthTables
			config: PlatformConfig
		}) {

	const {userId} = await tables.user.accountViaEmail.assert({
		...find({email}),
		make: async function makeNewAccountViaEmail() {
			const isTechnician = email === config.platform.technician.email

			const account = generateAccountRow({rando})
			const {userId} = account

			const operationCreatesAccount = tables.user.account.create(account)
			const operationCreatesTechnicianUserRole = isTechnician
				? tables.permissions.userHasRole.create({
					userId,
					hard: true,
					public: true,
					timeframeEnd: undefined,
					roleId: technicianRoleId,
					timeframeStart: undefined,
				})
				: Promise.resolve()

			await Promise.all([operationCreatesAccount, operationCreatesTechnicianUserRole])
			return {email, userId}
		},
	})

	return {userId}
}
