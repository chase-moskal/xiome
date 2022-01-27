
import {Id, find, assert} from "dbmage"

import {Rando} from "dbmage"
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

	await assert(
		databaseForApp.tables.auth.permissions.userHasRole,
		find({userId: adminUserId, roleId: adminRoleId}),
		async() => ({
			userId: adminUserId,
			roleId: adminRoleId,
			hard: false,
			public: true,
			timeframeEnd: undefined,
			timeframeStart: undefined,
			time: Date.now()
		})
	)
}
