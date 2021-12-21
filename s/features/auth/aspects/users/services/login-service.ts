
import * as renraku from "renraku"

import {AuthOptions} from "../../../types/auth-options.js"
import {LoginPayload} from "../../../types/auth-tokens.js"
import {find} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {signAuthTokens} from "../routines/login/sign-auth-tokens.js"
import {assertEmailAccount} from "../routines/login/assert-email-account.js"
import {schema, email as emailValidator} from "../../../../../toolbox/darkvalley.js"
import {runValidation} from "../../../../../toolbox/topic-validation/run-validation.js"
import {makePermissionsEngine} from "../../../../../assembly/backend/permissions/permissions-engine.js"

export const makeLoginService = ({
	rando, config, authPolicies,
	signToken, verifyToken, sendLoginEmail, generateNickname,
}: AuthOptions) => renraku.service()

.policy(authPolicies.anonPolicy)

.expose(({access, authTables, appTables}) => ({

	async sendLoginLink(inputs: {email: string}) {
		const {email: rawEmail} = runValidation(
			inputs,
			schema({email: emailValidator()}),
		)
		const email = rawEmail.toLowerCase()

		const appId = DamnId.fromString(access.appId)
		const appRow = await appTables.registrations.one(find({appId}))
		const {userId} = await assertEmailAccount({
			rando, email, config, authTables, generateNickname,
		})
		const loginTokenPayload = {userId: userId.toString()}
		await sendLoginEmail({
			appHome: appRow.home,
			appLabel: appRow.label,
			to: email,
			legalLink: config.platform.legalLink,
			platformLink: config.platform.appDetails.home,
			lifespan: config.crypto.tokenLifespans.login,
			loginToken: await signToken<LoginPayload>({
				payload: loginTokenPayload,
				lifespan: config.crypto.tokenLifespans.login,
			}),
		})
	},

	async authenticateViaLoginToken({loginToken}: {loginToken: string}) {
		const verified = await verifyToken<LoginPayload>(loginToken)
		const userId = DamnId.fromString(verified.userId)
		const authTokens = await signAuthTokens({
			userId,
			authTables,
			scope: {core: true},
			appId: access.appId,
			origins: access.origins,
			lifespans: config.crypto.tokenLifespans,
			permissionsEngine: makePermissionsEngine({
				isPlatform: access.appId === config.platform.appDetails.appId,
				permissionsTables: authTables.permissions,
			}),
			signToken,
		})

		await authTables.users.latestLogins.update({
			...find({userId}),
			upsert: {userId, time: Date.now()},
		})

		return authTokens
	},
}))
