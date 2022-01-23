
import {Id, find} from "../../../../../toolbox/dbproxy/dbproxy.js"

import {Rando} from "../../../../../toolbox/get-rando.js"
import {DatabaseSafe} from "../../../../../assembly/backend/types/database.js"
import {SecretConfig} from "../../../../../assembly/backend/types/secret-config.js"
import {assertEmailAccount} from "../../users/routines/login/assert-email-account.js"
import {appPermissions} from "../../../../../assembly/backend/permissions/standard-permissions.js"

const adminRoleId = Id.fromString(appPermissions.roles.admin.roleId)

export async function appointAdmin({
		email, rando, config, databaseForApp, generateNickname,
	}: {
		rando: Rando
		email: string
		config: SecretConfig
		databaseForApp: DatabaseSafe
		generateNickname: () => string
	}) {

	const {userId: adminUserId} = await assertEmailAccount({
		rando,
		email,
		config,
		databaseForApp,
		generateNickname,
	})

	await databaseForApp.tables.auth.permissions.userHasRole.assert({
		...find({userId: adminUserId, roleId: adminRoleId}),
		make: async () => ({
			userId: adminUserId,
			roleId: adminRoleId,
			hard: false,
			public: true,
			timeframeEnd: undefined,
			timeframeStart: undefined,
			time: Date.now()
		})
	})
}
