
import {ApiError} from "renraku/x/api/api-error.js"
import {Policy} from "renraku/x/types/primitives/policy.js"

import {isOriginValid} from "./routines/is-origin-valid.js"
import {prepareStatsHub} from "../stats-hub/prepare-stats-hub.js"
import {authTablesBakery} from "../tables/baking/auth-tables-bakery.js"
import {requireUserIsAllowedToEditApp} from "../topics/apps/require-user-is-allowed-to-edit-app.js"

import {App} from "../types/tokens/app.js"
import {AccessPayload} from "../types/tokens/access-payload.js"

import {GreenAuth} from "./types/green-auth.js"
import {GreenMeta} from "./types/green-meta.js"
import {AnonAuth} from "./types/anon-auth.js"
import {AnonMeta} from "./types/anon-meta.js"
import {UserAuth} from "./types/user-auth.js"
import {UserMeta} from "./types/user-meta.js"
import {PlatformUserAuth} from "./types/platform-user-auth.js"
import {PlatformUserMeta} from "./types/platform-user-meta.js"
import {AppOwnerMeta} from "./types/app-owner-meta.js"
import {AppOwnerAuth} from "./types/app-owner-auth.js"
import {AuthPolicyOptions} from "./types/auth-policy-options.js"
import {makePrivilegeChecker} from "../tools/permissions/make-privilege-checker.js"
import {appPrivileges} from "../../../assembly/backend/permissions/standard/app/app-privileges.js"
import {platformPrivileges} from "../../../assembly/backend/permissions/standard/platform/platform-privileges.js"
import {isUserOwnerOfApp} from "../topics/apps/is-user-the-owner-of-app.js"

export function prepareAuthPolicies({
			config,
			tables,
			verifyToken,
		}: AuthPolicyOptions) {

	const bakeTables = authTablesBakery({config, tables})
	const getStatsHub = prepareStatsHub({tables})

	const green: Policy<GreenMeta, GreenAuth> = {
		processAuth: async(meta, request) => {
			return {bakeTables}
		},
	}

	const anon: Policy<AnonMeta, AnonAuth> = {
		processAuth: async(meta, request) => {
			const app = await verifyToken<App>(meta.appToken)
			if (!isOriginValid(request, app))
				throw new ApiError(403, "invalid origin")
			return {
				app,
				tables: await bakeTables(app.appId),
			}
		},
	}

	const user: Policy<UserMeta, UserAuth> = {
		processAuth: async({accessToken, ...meta}, request) => {
			const auth = await anon.processAuth(meta, request)
			const access = await verifyToken<AccessPayload>(accessToken)
			const checker = makePrivilegeChecker(access.permit, appPrivileges)
			return {...auth, access, checker}
		},
	}

	const platformUser: Policy<PlatformUserMeta, PlatformUserAuth> = {
		processAuth: async(meta, request) => {
			const auth = await user.processAuth(meta, request)
			if (!auth.app.platform)
				throw new ApiError(403, "forbidden: only platform users allowed here")
			const checker = makePrivilegeChecker(auth.access.permit, platformPrivileges)
			const statsHub = await getStatsHub(auth.access.user.userId)
			return {...auth, checker, statsHub}
		},
	}

	const userWhoManagesPermissions: Policy<UserMeta, UserAuth> = {
		processAuth: async(meta, request) => {
			const auth = await user.processAuth(meta, request)
			auth.checker.requirePrivilege("customize privileges")
			return auth
		},
	}

	const appOwner: Policy<
			AppOwnerMeta,
			AppOwnerAuth
		> = {
		processAuth: async(meta, request) => {
			const auth = await platformUser.processAuth(meta, request)
			async function getTablesNamespacedForApp(appId: string) {
				const canEditAnyApp = auth.checker.hasPrivilege("edit any app")
				const isOwner = isUserOwnerOfApp({appId, access: auth.access, tables})
				const allowed = isOwner || canEditAnyApp
				if (!allowed)
					throw new ApiError(403, "forbidden: not privileged over app")
				return bakeTables(appId)
			}
			return {...auth, getTablesNamespacedForApp}
		},
	}

	return {
		green,
		anon,
		user,
		appOwner,
		platformUser,
		userWhoManagesPermissions,
	}
}
