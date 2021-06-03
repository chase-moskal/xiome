
import {asTopic} from "renraku/x/identities/as-topic.js"

import {fetchUser} from "./login/user/fetch-user.js"
import {AnonAuth} from "../policies/types/anon-auth.js"
import {AuthApiOptions} from "../types/auth-api-options.js"
import {makePermissionsEngine} from "../../../assembly/backend/permissions2/permissions-engine.js"

export const userTopic = ({config}: AuthApiOptions) => asTopic<AnonAuth>()({

	async getUser({tables, access}, {userId}: {userId: string}) {
		const permissionsEngine = makePermissionsEngine({
			isPlatform: access.appId === config.platform.appDetails.appId,
			permissionsTables: tables.permissions,
		})
		return await fetchUser({userId, authTables: tables, permissionsEngine})
	},
})
