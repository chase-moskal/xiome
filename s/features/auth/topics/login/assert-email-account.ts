
import {Rando} from "../../../../toolbox/get-rando.js"
import {AuthTables} from "../../tables/types/auth-tables.js"
import {generateAccountRow} from "./generate-account-row.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {PlatformConfig} from "../../../../assembly/backend/types/platform-config.js"
import {universalPermissions} from "../../../../assembly/backend/permissions2/standard-permissions.js"
import {initializeUserProfile} from "./user/profile/initialize-user-profile.js"

const technicianRoleId = universalPermissions.roles.technician.roleId

export async function assertEmailAccount({
			rando, email, tables, config, generateNickname,
		}: {
			rando: Rando
			email: string
			tables: AuthTables
			config: PlatformConfig
			generateNickname: () => string
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

			const operationInitializesProfile = initializeUserProfile({
				userId,
				email,
				authTables: tables,
				generateNickname,
			})

			await Promise.all([
				operationCreatesAccount,
				operationCreatesTechnicianUserRole,
				operationInitializesProfile,
			])

			return {email, userId}
		},
	})

	return {userId}
}
