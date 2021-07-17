
import {ApiError} from "renraku/x/api/api-error.js"
import {VerifyToken} from "redcrypto/dist/types.js"
import {Policy} from "renraku/x/types/primitives/policy.js"

import {AuthTables} from "../types/auth-tables.js"
import {AccessPayload} from "../types/auth-tokens.js"
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {AppTables} from "../aspects/apps/types/app-tables.js"
import {namespaceTables} from "../../../framework/api/namespace-tables.js"
import {isOriginValid} from "../../auth/policies/routines/is-origin-valid.js"
import {SecretConfig} from "../../../assembly/backend/types/secret-config.js"
import {makePrivilegeChecker} from "../aspects/permissions/tools/make-privilege-checker.js"
import {appPermissions} from "../../../assembly/backend/permissions2/standard-permissions.js"
import {AnonAuth, AnonMeta, GreenAuth, GreenMeta, UserAuth, UserMeta} from "../types/auth-metas.js"

export function basicPolicies({
		config, appTables, authTables, verifyToken,
	}: {
		config: SecretConfig
		appTables: AppTables
		authTables: AuthTables
		verifyToken: VerifyToken
	}) {

	const authTablesForApp = (appId: DamnId) => namespaceTables(appId, authTables)

	const greenPolicy: Policy<GreenMeta, GreenAuth> = async(meta, request) => ({
		appTables,
		authTablesForApp,
	})

	const anonPolicy: Policy<AnonMeta, AnonAuth> = async({accessToken}, request) => {
		const access = await verifyToken<AccessPayload>(accessToken)
		if (isOriginValid(request, access.origins))
			return {
				access,
				authTables: authTablesForApp(DamnId.fromString(access.appId)),
				checker: makePrivilegeChecker(access.permit, appPermissions.privileges)
			}
		else
			throw new ApiError(403, "invalid origin")
	}

	const userPolicy: Policy<UserMeta, UserAuth> = async(meta, request) => {
		const auth = await anonPolicy(meta, request)
		if (auth.access.user)
			return auth
		else
			throw new ApiError(403, "not logged in")
	}

	return {
		greenPolicy,
		anonPolicy,
		userPolicy,
	}
}
