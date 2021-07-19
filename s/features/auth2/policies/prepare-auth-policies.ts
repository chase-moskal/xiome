
import {ApiError} from "renraku/x/api/api-error.js"
import {VerifyToken} from "redcrypto/dist/types.js"
import {Policy} from "renraku/x/types/primitives/policy.js"

import {AuthTables} from "../types/auth-tables.js"
import {isOriginValid} from "./is-origin-valid.js"
import {AccessPayload} from "../types/auth-tokens.js"
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {AppTables} from "../aspects/apps/types/app-tables.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {prepareStatsHub} from "../aspects/permissions/tools/prepare-stats-hub.js"
import {makePrivilegeChecker} from "../aspects/permissions/tools/make-privilege-checker.js"
import {UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"
import {appPermissions, platformPermissions} from "../../../assembly/backend/permissions2/standard-permissions.js"
import {AnonAuth, AnonMeta, GreenAuth, GreenMeta, PlatformUserAuth, PlatformUserMeta, UserAuth, UserMeta} from "../types/auth-metas.js"

export function prepareAuthPolicies({
		config, appTables, authTables, verifyToken,
	}: {
		config: SecretConfig
		appTables: AppTables
		authTables: UnconstrainedTables<AuthTables>
		verifyToken: VerifyToken
	}) {

	const getStatsHub = prepareStatsHub({appTables, authTables})

	const greenPolicy: Policy<GreenMeta, GreenAuth> = async(meta, request) => ({
		appTables,
		authTables,
	})

	const anonPolicy: Policy<AnonMeta, AnonAuth> = (async({accessToken}, request) => {
		const access = await verifyToken<AccessPayload>(accessToken)
		if (isOriginValid(request, access.origins))
			return {
				access,
				authTables: authTables.namespaceForApp(DamnId.fromString(access.appId)),
				checker: makePrivilegeChecker(access.permit, appPermissions.privileges),
			}
		else
			throw new ApiError(403, "invalid origin")
	})

	const userPolicy: Policy<UserMeta, UserAuth> = (async(meta, request) => {
		const auth = await anonPolicy(meta, request)
		if (auth.access.user)
			return auth
		else
			throw new ApiError(403, "not logged in")
	})

	const platformUserPolicy: Policy<PlatformUserMeta, PlatformUserAuth> = (async(meta, request) => {
		const auth = await userPolicy(meta, request)
		if (auth.access.appId === config.platform.appDetails.appId) {
			return {
				...auth,
				authTables,
				checker: makePrivilegeChecker(auth.access.permit, platformPermissions.privileges),
				statsHub: await getStatsHub(DamnId.fromString(auth.access.user.userId)),
			}
		}
		else
			throw new ApiError(403, "not platform app")
	})

	return {
		greenPolicy,
		anonPolicy,
		userPolicy,
		platformUserPolicy,
	}
}
