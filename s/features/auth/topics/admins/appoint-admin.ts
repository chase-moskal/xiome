
import {Rando} from "../../../../toolbox/get-rando.js"
import {AuthTables} from "../../tables/types/auth-tables.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {assertEmailAccount} from "../login/assert-email-account.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {appPermissions} from "../../../../assembly/backend/permissions2/standard-permissions.js"

const adminRoleId = appPermissions.roles.admin.roleId

export async function appointAdmin({
		email, tablesForApp, rando, config, generateNickname,
	}: {
		rando: Rando
		email: string
		config: SecretConfig
		tablesForApp: AuthTables
		generateNickname: () => string
	}) {

	const {userId: adminUserId} = await assertEmailAccount({
		rando,
		email,
		config,
		tables: tablesForApp,
		generateNickname,
	})

	await tablesForApp.permissions.userHasRole.assert({
		...find({userId: adminUserId, roleId: adminRoleId}),
		make: async () => ({
			userId: adminUserId,
			roleId: adminRoleId,
			hard: false,
			public: true,
			timeframeEnd: undefined,
			timeframeStart: undefined,
		})
	})
}
