
import {AuthTables} from "../../../types/auth-tables.js"
import {Rando} from "../../../../../toolbox/get-rando.js"
import {find} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {SecretConfig} from "../../../../../assembly/backend/types/secret-config.js"
import {assertEmailAccount} from "../../users/routines/login/assert-email-account.js"
import {appPermissions} from "../../../../../assembly/backend/permissions/standard-permissions.js"

const adminRoleId = DamnId.fromString(appPermissions.roles.admin.roleId)

export async function appointAdmin({
		email, authTables, rando, config, generateNickname,
	}: {
		rando: Rando
		email: string
		config: SecretConfig
		authTables: AuthTables
		generateNickname: () => string
	}) {

	const {userId: adminUserId} = await assertEmailAccount({
		rando,
		email,
		config,
		authTables,
		generateNickname,
	})

	await authTables.permissions.userHasRole.assert({
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
