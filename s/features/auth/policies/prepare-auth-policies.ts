
import {VerifyToken} from "redcrypto/dist/types.js"
import {ApiError} from "renraku/x/api/api-error.js"
import {Policy} from "renraku/x/types/primitives/policy.js"

import {basePolicies} from "./base/base-policies.js"
import {prepareStatsHub} from "../prepare-stats-hub.js"
import {AuthTables} from "../tables/types/auth-tables.js"
import {authTablesBakery} from "../tables/baking/auth-tables-bakery.js"
import {userHasHardPrivilege} from "../topics/permissions/user-has-hard-privilege.js"
import {AppTables} from "../types/AppTables"
import {PermissionsTables} from "../types/PermissionsTables"
import {AccessPayload} from "../types/AccessPayload"
import {GetStatsHub} from "../types/GetStatsHub"
import {UnconstrainedPlatformUserAuth} from "../types/UnconstrainedPlatformUserAuth"
import {UnconstrainedPlatformUserMeta} from "../types/UnconstrainedPlatformUserMeta"
import {PlatformUserAuth} from "../types/PlatformUserAuth"
import {PlatformUserMeta} from "../types/PlatformUserMeta"
import {UserAuth} from "../types/UserAuth"
import {UserMeta} from "../types/UserMeta"
import {AnonAuth} from "../types/AnonAuth"
import {AnonMeta} from "../types/AnonMeta"
import {GreenAuth} from "../types/GreenAuth"
import {GreenMeta} from "../types/GreenMeta"
import {PlatformConfig} from "../types/PlatformConfig"

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
