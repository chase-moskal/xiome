
import {PlatformConfig} from "../../types/platform-config.js"
import {Rando} from "../../../../toolbox/get-rando.js"
import {generateAccountRow} from "./generate-account-row.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {AuthTables} from "../../tables/types/auth-tables.js"

export async function assertEmailAccount({
			rando,
			email,
			tables,
			config,
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
			const {roleId} = config.permissions.platform.roles.find(row => row.label === "technician")

			const account = generateAccountRow({rando})
			const {userId} = account

			const operationCreatesAccount = tables.user.account.create(account)
			const operationCreatesTechnicianUserRole = isTechnician
				? tables.permissions.userHasRole.create({
					userId,
					roleId,
					public: true,
					timeframeStart: undefined,
					timeframeEnd: undefined,
					hard: true,
				})
				: Promise.resolve()

			await Promise.all([operationCreatesAccount, operationCreatesTechnicianUserRole])
			return {email, userId}
		},
	})

	return {userId}
}
