
import {VerifyToken} from "redcrypto/x/types.js"
import {RenrakuPolicy, RenrakuError} from "renraku"

import {AuthTables} from "../types/auth-tables.js"
import {AccessPayload} from "../types/auth-tokens.js"
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {AppTables} from "../aspects/apps/types/app-tables.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {prepareStatsHub} from "../aspects/permissions/tools/prepare-stats-hub.js"
import {isUserOwnerOfApp} from "../aspects/apps/utils/is-user-the-owner-of-app.js"
import {makePrivilegeChecker} from "../aspects/permissions/tools/make-privilege-checker.js"
import {UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"
import {appPermissions, platformPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"
import {AnonMeta, AppOwnerAuth, AppOwnerMeta, GreenAuth, GreenMeta, LoginAuth, PlatformUserAuth, PlatformUserMeta, UserAuth, UserMeta} from "../types/auth-metas.js"

export function prepareAuthPolicies({
		config, appTables, authTables, verifyToken,
	}: {
		config: SecretConfig
		appTables: AppTables
		authTables: UnconstrainedTables<AuthTables>
		verifyToken: VerifyToken
	}) {

	const getStatsHub = prepareStatsHub({appTables, authTables})

	const greenPolicy: RenrakuPolicy<GreenMeta, GreenAuth> = async meta => ({
		appTables,
		authTables,
	})

	const anonPolicy: RenrakuPolicy<AnonMeta, LoginAuth> = async({accessToken}, headers) => {
		const access = await verifyToken<AccessPayload>(accessToken)

		if (access.origins.some(origin => origin === headers.origin))
			return {
				access,
				appTables,
				authTables: authTables.namespaceForApp(DamnId.fromString(access.appId)),
				checker: makePrivilegeChecker(access.permit, appPermissions.privileges),
			}
		else
			throw new RenrakuError(403, "request origin not allowed")
	}

	const userPolicy: RenrakuPolicy<UserMeta, UserAuth> = async(meta, headers) => {
		const auth = await anonPolicy(meta, headers)
		if (auth.access.user)
			return auth
		else
			throw new RenrakuError(403, "not logged in")
	}

	const platformUserPolicy: RenrakuPolicy<PlatformUserMeta, PlatformUserAuth> = async(meta, headers) => {
		const auth = await userPolicy(meta, headers)
		if (auth.access.appId === config.platform.appDetails.appId) {
			return {
				...auth,
				appTables,
				authTables,
				checker: makePrivilegeChecker(auth.access.permit, platformPermissions.privileges),
				statsHub: await getStatsHub(DamnId.fromString(auth.access.user.userId)),
			}
		}
		else
			throw new RenrakuError(403, "not platform app")
	}

	const appOwnerPolicy: RenrakuPolicy<AppOwnerMeta, AppOwnerAuth> = async(meta, headers) => {
		const auth = await platformUserPolicy(meta, headers)
		async function authorizeAppOwner(appId: DamnId) {
			const allowedToEditAnyApp = auth.checker.hasPrivilege("edit any app")
			const isOwnerOfApp = isUserOwnerOfApp({appId, appTables, access: auth.access})
			const allowed = isOwnerOfApp || allowedToEditAnyApp
			if (allowed)
				return {authTables: auth.authTables.namespaceForApp(appId)}
			else
				throw new RenrakuError(403, "forbidden: lacking privileges to edit app")
		}
		return {
			access: auth.access,
			checker: auth.checker,
			statsHub: auth.statsHub,
			appTables: auth.appTables,
			authTablesForPlatform: auth.authTables.namespaceForApp(
				DamnId.fromString(config.platform.appDetails.appId)
			),
			authorizeAppOwner,
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
