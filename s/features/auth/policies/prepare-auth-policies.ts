
import {VerifyToken} from "redcrypto/dist/types.js"
import {ApiError} from "renraku/x/api/api-error.js"
import {Policy} from "renraku/x/types/primitives/policy.js"

import {throwInvalidOrigin} from "./routines/throw-invalid-origin.js"
import {PlatformConfig, AccessPayload, AnonAuth, AnonMeta, App, AuthTables, GetTables, GreenAuth, GreenMeta, PlatformUserAuth, PlatformUserMeta, UserAuth, UserMeta, GetStatsHub, UnconstrainedPlatformUserAuth, UnconstrainedPlatformUserMeta} from "../auth-types.js"
import { requireUserCanManagePermissions } from "../topics/permissions/require-user-can-manage-permissions.js"
import { userHasHardPrivilege } from "../topics/permissions/user-has-hard-privilege.js"

export function prepareAuthPolicies({
		config,
		verifyToken,
		getAuthTables,
		getStatsHub,
	}: {
		config: PlatformConfig
		verifyToken: VerifyToken
		getAuthTables: GetTables<AuthTables>
		getStatsHub: GetStatsHub
	}) {

	const green: Policy<GreenMeta, GreenAuth> = {
		processAuth: async(meta, request) => {
			return {getAuthTables}
		},
	}

	const anon: Policy<AnonMeta, AnonAuth> = {
		processAuth: async({appToken}, request) => {
			const app = await verifyToken<App>(appToken)
			throwInvalidOrigin(request, app)
			const tables = await getAuthTables({appId: app.appId})
			return {app, tables}
		},
	}

	const user: Policy<UserMeta, UserAuth> = {
		processAuth: async({accessToken, ...anonMeta}, request) => {
			const anonAuth = await anon.processAuth(anonMeta, request)
			const access = await verifyToken<AccessPayload>(accessToken)
			return {...anonAuth, access}
		},
	}

	const platformUser: Policy<PlatformUserMeta, PlatformUserAuth> = {
		processAuth: async(userMeta, request) => {
			const userAuth = await user.processAuth(userMeta, request)
			if (!userAuth.app.platform)
				throw new ApiError(403, "forbidden: only platform users allowed here")
			const statsHub = await getStatsHub(userAuth.access.user.userId)
			return {...userAuth, statsHub}
		},
	}

	const userWhoManagesPermissions: Policy<UserMeta, UserAuth> = {
		processAuth: async(userMeta, request) => {
			const userAuth = await user.processAuth(userMeta, request)
			if (!userHasHardPrivilege({
					config,
					access: userAuth.access,
					privilegeLabel: "manage_permissions",
				}))
				throw new ApiError(403, "forbidden: not allowed to manage permissions")
			return userAuth
		},
	}

	const unconstrainedPlatformUser: Policy<
			UnconstrainedPlatformUserMeta,
			UnconstrainedPlatformUserAuth
		> = {
		processAuth: async(userMeta, request) => {
			const platformAuth = await platformUser.processAuth(userMeta, request)
			return {...platformAuth, getAuthTables}
		},
	}

	return {green, anon, user, platformUser, userWhoManagesPermissions, unconstrainedPlatformUser}
}
