
import {Rando} from "../../../../toolbox/get-rando.js"
import {generateAccountRow} from "./generate-account-row.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {AuthTables, PermissionsTables, PlatformConfig} from "../../auth-types.js"

export async function assertEmailAccount({
			rando,
			email,
			config,
			authTables,
			permissionsTables,
		}: {
			rando: Rando
			email: string
			config: PlatformConfig
			authTables: AuthTables
			permissionsTables: PermissionsTables
		}) {

	const {userId} = await authTables.accountViaEmail.assert({
		...find({email}),
		make: async function makeNewAccountViaEmail() {
			const isTechnician = email === config.platform.technician.email
			const {roleId} = config.permissions.platform.roles.find(row => row.label === "technician")

			const account = generateAccountRow({rando})
			const {userId} = account

			const operationCreatesAccount = authTables.account.create(account)
			const operationCreatesTechnicianUserRole = isTechnician
				? permissionsTables.userHasRole.create({
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
