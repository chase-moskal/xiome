
import {VerifyToken} from "redcrypto/dist/types.js"
import {ApiError} from "renraku/x/api/api-error.js"
import {Policy} from "renraku/x/types/primitives/policy.js"

import {basePolicies} from "./base/base-policies.js"
import {prepareStatsHub} from "../tables/prepare-stats-hub.js"
import {bakeryForAppTables} from "../tables/bakery-for-app-tables.js"
import {prepareTableNamespacer} from "../tables/prepare-table-namespacer.js"
import {userHasHardPrivilege} from "../topics/permissions/user-has-hard-privilege.js"
import {bakeryForPermissionsTables} from "../tables/bakery-for-permissions-tables.js"
import {PlatformConfig, AccessPayload, AnonAuth, AnonMeta, AuthTables, GreenAuth, GreenMeta, PlatformUserAuth, PlatformUserMeta, UserAuth, UserMeta, GetStatsHub, UnconstrainedPlatformUserAuth, UnconstrainedPlatformUserMeta, AppTables, PermissionsTables} from "../auth-types.js"

export function prepareAuthPolicies({
			config,
			appTables,
			authTables,
			permissionsTables,
			verifyToken,
		}: {
			config: PlatformConfig
			appTables: AppTables
			authTables: AuthTables
			permissionsTables: PermissionsTables
			verifyToken: VerifyToken
		}) {

	const base = basePolicies({verifyToken})
	const getStatsHub = prepareStatsHub({appTables, authTables})
	const bakeAppTables = bakeryForAppTables({config, appTables})
	const namespaceAuthTables = prepareTableNamespacer(authTables)
	const bakePermissionsTables = bakeryForPermissionsTables({config, permissionsTables})

	const green: Policy<GreenMeta, GreenAuth> = {
		processAuth: async(meta, request) => {
			return {bakeAppTables}
		},
	}

	const anon: Policy<AnonMeta, AnonAuth> = {
		processAuth: async(meta, request) => {
			const auth = await base.baseAnon.processAuth(meta, request)
			const {appId} = auth.app
			return {
				...auth,
				appTables: await bakeAppTables(appId),
				authTables: namespaceAuthTables(appId),
				permissionsTables: await bakePermissionsTables(appId),
			}
		},
	}

	const user: Policy<UserMeta, UserAuth> = {
		processAuth: async({accessToken, ...meta}, request) => {
			const auth = await anon.processAuth(meta, request)
			const access = await verifyToken<AccessPayload>(accessToken)
			return {...auth, access}
		},
	}

	const platformUser: Policy<PlatformUserMeta, PlatformUserAuth> = {
		processAuth: async(meta, request) => {
			const auth = await user.processAuth(meta, request)
			if (!auth.app.platform)
				throw new ApiError(403, "forbidden: only platform users allowed here")
			const statsHub = await getStatsHub(auth.access.user.userId)
			return {...auth, statsHub}
		},
	}

	const userWhoManagesPermissions: Policy<UserMeta, UserAuth> = {
		processAuth: async(meta, request) => {
			const auth = await user.processAuth(meta, request)
			const allowed = userHasHardPrivilege({
				config,
				access: auth.access,
				privilegeLabel: "manage_permissions",
			})
			if (!allowed)
				throw new ApiError(403, "forbidden: not allowed to manage permissions")
			return auth
		},
	}

	const unconstrainedPlatformUser: Policy<
			UnconstrainedPlatformUserMeta,
			UnconstrainedPlatformUserAuth
		> = {
		processAuth: async(meta, request) => {
			const auth = await platformUser.processAuth(meta, request)
			return {
				...auth,
				appTables,
				namespaceAuthTables: prepareTableNamespacer(authTables),
				namespacePermissionsTables: prepareTableNamespacer(permissionsTables),
			}
		},
	}

	return {
		green,
		anon,
		user,
		platformUser,
		userWhoManagesPermissions,
		unconstrainedPlatformUser,
	}
}
