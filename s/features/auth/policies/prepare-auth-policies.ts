
import {VerifyToken} from "redcrypto/dist/types.js"
import {ApiError} from "renraku/x/api/api-error.js"
import {Policy} from "renraku/x/types/primitives/policy.js"

import {basePolicies} from "./base/base-policies.js"
import {prepareStatsHub} from "../prepare-stats-hub.js"
import {authTablesBakery} from "../tables/baking/auth-tables-bakery.js"
import {userHasHardPrivilege} from "../topics/permissions/user-has-hard-privilege.js"

import {AccessPayload} from "../types/tokens/access-payload.js"
import {AuthTables} from "../tables/types/auth-tables.js"
import {PlatformConfig} from "../types/platform-config.js"

import {GreenAuth} from "./types/green-auth.js"
import {GreenMeta} from "./types/green-meta.js"
import {AnonAuth} from "./types/anon-auth.js"
import {AnonMeta} from "./types/anon-meta.js"
import {UserAuth} from "./types/user-auth.js"
import {UserMeta} from "./types/user-meta.js"
import {PlatformUserAuth} from "./types/platform-user-auth.js"
import {PlatformUserMeta} from "../policies/types/platform-user-meta.js"
import {UnconstrainedPlatformUserAuth} from "./types/unconstrained-platform-user-auth.js"
import {UnconstrainedPlatformUserMeta} from "./types/unconstrained-platform-user-meta.js"

export function prepareAuthPolicies({
			config,
			tables,
			verifyToken,
		}: {
			tables: AuthTables
			config: PlatformConfig
			verifyToken: VerifyToken
		}) {

	const base = basePolicies({verifyToken})
	const bakeTables = authTablesBakery({config, tables})
	const getStatsHub = prepareStatsHub({tables})

	const green: Policy<GreenMeta, GreenAuth> = {
		processAuth: async(meta, request) => {
			return {bakeTables}
		},
	}

	const anon: Policy<AnonMeta, AnonAuth> = {
		processAuth: async(meta, request) => {
			const auth = await base.baseAnon.processAuth(meta, request)
			const {appId} = auth.app
			return {
				...auth,
				tables: await bakeTables(appId),
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
			return {...auth, bakeTables}
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
