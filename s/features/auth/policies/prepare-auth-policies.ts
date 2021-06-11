
import {ApiError} from "renraku/x/api/api-error.js"
import {Policy} from "renraku/x/types/primitives/policy.js"

import {isOriginValid} from "./routines/is-origin-valid.js"
import {prepareStatsHub} from "../stats-hub/prepare-stats-hub.js"
import {authTablesBakery} from "../tables/baking/auth-tables-bakery.js"

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
import {isUserOwnerOfApp} from "../topics/apps/is-user-the-owner-of-app.js"
import {makePrivilegeChecker} from "../tools/permissions/make-privilege-checker.js"
import {appPermissions, platformPermissions} from "../../../assembly/backend/permissions2/standard-permissions.js"

export function prepareAuthPolicies({
			config,
			tables,
			verifyToken,
		}: AuthPolicyOptions) {

	const bakeTables = authTablesBakery({config, tables})
	const getStatsHub = prepareStatsHub({tables})

	// policy for completely unknown user
	const green: Policy<GreenMeta, GreenAuth> = {
		processAuth: async(meta, request) => {
			return {bakeTables}
		},
	}

	// policy for authorized anonymous user
	const anon: Policy<AnonMeta, AnonAuth> = {
		processAuth: async({accessToken}, request) => {
			const access = await verifyToken<AccessPayload>(accessToken)
			if (isOriginValid(request, access.origins))
				return {
					access,
					tables: await bakeTables(access.appId),
					checker: makePrivilegeChecker(access.permit, appPermissions.privileges),
				}
			else
				throw new ApiError(403, "invalid origin")
		},
	}

	// policy for logged in user
	const user: Policy<UserMeta, UserAuth> = {
		processAuth: async(meta, request) => {
			const auth = await anon.processAuth(meta, request)
			if (auth.access.user)
				return auth
			else
				throw new ApiError(403, "not logged in")
		},
	}

	// app user who is allowed to manage permissions
	const userWhoManagesPermissions: Policy<UserMeta, UserAuth> = {
		processAuth: async(meta, request) => {
			const auth = await user.processAuth(meta, request)
			auth.checker.requirePrivilege("customize permissions")
			return auth
		},
	}

	// user who is allowed to view statistics
	const statsViewer: Policy<UserMeta, UserAuth> = {
		processAuth: async(meta, request) => {
			const auth = await user.processAuth(meta, request)
			auth.checker.requirePrivilege("view stats")
			return auth
		},
	}

	// policy for logged in user on the platform app
	const platformUser: Policy<PlatformUserMeta, PlatformUserAuth> = {
		processAuth: async(meta, request) => {
			const auth = await user.processAuth(meta, request)
			if (auth.access.appId == config.platform.appDetails.appId)
				return {
					...auth,
					checker: makePrivilegeChecker(auth.access.permit, platformPermissions.privileges),
					statsHub: await getStatsHub(auth.access.user.userId),
				}
			else
				throw new ApiError(403, "not platform app")
		},
	}

	// platform user who is the owner of an app
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
				if (allowed)
					return bakeTables(appId)
				else
					throw new ApiError(403, "forbidden: not privileged over app")
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
