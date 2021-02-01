

import {VerifyToken} from "redcrypto/dist/types.js"
import {ApiError} from "renraku/x/api/api-error.js"
import {Policy} from "renraku/x/types/primitives/policy.js"

import {AccessPayload, AnonAuth, AnonMeta, AppPayload, AuthTables, GetTables, PlatformUserAuth, PlatformUserMeta, UserAuth, UserMeta} from "../auth-types.js"

export function prepareAuthPolicies({verifyToken, getAuthTables}: {
		verifyToken: VerifyToken
		getAuthTables: GetTables<AuthTables>
	}) {

	//
	// TODO
	// origin verification
	//

	const anon: Policy<AnonMeta, AnonAuth> = {
		processAuth: async({appToken}, request) => {
			const app = await verifyToken<AppPayload>(appToken)
			const tables = getAuthTables({appId: app.appId})
			return {app, tables}
		},
	}

	const user: Policy<UserMeta, UserAuth> = {
		processAuth: async({accessToken, ...anonMeta}, request) => {
			const anonAuth = await anon.processAuth(anonMeta, request)
			const access = await verifyToken<AccessPayload>(accessToken)
			return {access, ...anonAuth}
		},
	}

	const platformUser: Policy<PlatformUserMeta, PlatformUserAuth> = {
		processAuth: async(userMeta, request) => {
			const userAuth = await user.processAuth(userMeta, request)
			if (!userAuth.app.platform)
				throw new ApiError(403, "forbiddden: only platform users allowed here")
			return userAuth
		},
	}

	return {anon, user, platformUser}
}
