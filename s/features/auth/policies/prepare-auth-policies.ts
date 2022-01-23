
import * as renraku from "renraku"
import {VerifyToken} from "redcrypto/x/types.js"
import * as dbproxy from "../../../toolbox/dbproxy/dbproxy.js"

import {AccessPayload} from "../types/auth-tokens.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {DatabaseSelect} from "../../../assembly/backend/types/database.js"
import {UnconstrainedTable} from "../../../framework/api/unconstrained-table.js"
import {prepareStatsHub} from "../aspects/permissions/tools/prepare-stats-hub.js"
import {isUserOwnerOfApp} from "../aspects/apps/utils/is-user-the-owner-of-app.js"
import {makePrivilegeChecker} from "../aspects/permissions/tools/make-privilege-checker.js"
import {appPermissions, platformPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"
import {AnonMeta, AppOwnerAuth, AppOwnerMeta, GreenAuth, GreenMeta, LoginAuth, PlatformUserAuth, PlatformUserMeta, UserAuth, UserMeta} from "../types/auth-metas.js"

export function prepareAuthPolicies({
		config, database, verifyToken,
	}: {
		config: SecretConfig
		database: DatabaseSelect<"apps" | "auth">
		verifyToken: VerifyToken
	}) {

	const getStatsHub = prepareStatsHub({database})

	const greenPolicy: renraku.Policy<GreenMeta, GreenAuth> = async meta => ({
		database,
	})

	const anonPolicy: renraku.Policy<AnonMeta, LoginAuth> = async({accessToken}, headers) => {
		const access = await verifyToken<AccessPayload>(accessToken)
		if (access.origins.some(origin => origin === headers.origin))
			return <LoginAuth>{
				access,
				database: UnconstrainedTable.constrainDatabaseForApp({
					appId: dbproxy.Id.fromString(access.appId),
					database: dbproxy.subsection(database, tables => ({auth: tables.auth})),
				}),
				checker: makePrivilegeChecker(access.permit, appPermissions.privileges),
			}
		else
			throw new renraku.ApiError(403, "request origin not allowed")
	}

	const userPolicy: renraku.Policy<UserMeta, UserAuth> = async(meta, headers) => {
		const auth = await anonPolicy(meta, headers)
		if (auth.access.user)
			return auth
		else
			throw new renraku.ApiError(403, "not logged in")
	}

	const platformUserPolicy: renraku.Policy<PlatformUserMeta, PlatformUserAuth> = async(meta, headers) => {
		const auth = await userPolicy(meta, headers)
		const userId = dbproxy.Id.fromString(auth.access.user.userId)
		if (auth.access.appId === config.platform.appDetails.appId) {
			return {
				...auth,
				database,
				checker: makePrivilegeChecker(auth.access.permit, platformPermissions.privileges),
				statsHub: await getStatsHub(userId),
			}
		}
		else
			throw new renraku.ApiError(403, "not platform app")
	}

	const appOwnerPolicy: renraku.Policy<AppOwnerMeta, AppOwnerAuth> = async(meta, headers) => {
		const auth = await platformUserPolicy(meta, headers)
		const appTables = database.tables.apps
		return {
			access: auth.access,
			checker: auth.checker,
			statsHub: auth.statsHub,
			authTablesForPlatform: UnconstrainedTable.constrainTablesForApp({
				appId: dbproxy.Id.fromString(config.platform.appDetails.appId),
				unconstrainedTables: database.tables.auth,
			}),
			async authorizeAppOwner(appId: dbproxy.Id) {
				const allowedToEditAnyApp = auth.checker.hasPrivilege("edit any app")
				const isOwnerOfApp = isUserOwnerOfApp({appId, appTables, access: auth.access})
				const allowed = isOwnerOfApp || allowedToEditAnyApp
				if (allowed)
					return {
						authTables: UnconstrainedTable.constrainTablesForApp({
							appId,
							unconstrainedTables: database.tables.auth,
						})
					}
				else
					throw new renraku.ApiError(403, "forbidden: lacking privileges to edit app")
			},
		}
	}

	return {
		greenPolicy,
		anonPolicy,
		userPolicy,
		platformUserPolicy,
		appOwnerPolicy,
	}
}
