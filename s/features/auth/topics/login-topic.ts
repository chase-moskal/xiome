
import {asTopic} from "renraku/x/identities/as-topic.js"

import {AnonAuth} from "../policies/types/anon-auth.js"
import {signAuthTokens} from "./login/sign-auth-tokens.js"
import {find} from "../../../toolbox/dbby/dbby-helpers.js"
import {AuthApiOptions} from "../types/auth-api-options.js"
import {LoginPayload} from "../types/tokens/login-payload.js"
import {assertEmailAccount} from "./login/assert-email-account.js"
import {makePermissionsEngine} from "../../../assembly/backend/permissions2/permissions-engine.js"
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"

export const loginTopic = ({
		rando,
		config,
		signToken,
		verifyToken,
		sendLoginEmail,
		generateNickname,
	}: AuthApiOptions) => asTopic<AnonAuth>()({

	async sendLoginLink(
			{access, tables},
			{email}: {email: string},
		) {
		const appRow = await tables.app.app.one(find({id_app: access.id_app}))
		const {userId} = await assertEmailAccount({
			rando, email, config, tables, generateNickname,
		})
		await sendLoginEmail({
			appHome: appRow.home,
			appLabel: appRow.label,
			to: email,
			legalLink: config.platform.legalLink,
			platformLink: config.platform.appDetails.home,
			lifespan: config.crypto.tokenLifespans.login,
			loginToken: await signToken<LoginPayload>({
				payload: {userId: userId.toString()},
				lifespan: config.crypto.tokenLifespans.login,
			}),
		})
	},

	async authenticateViaLoginToken(
			{tables, access},
			{loginToken}: {loginToken: string},
		) {
		const {userId: userIdString} = await verifyToken<LoginPayload>(loginToken)
		const userId = DamnId.fromString(userIdString)
		const authTokens = await signAuthTokens({
			userId,
			tables,
			scope: {core: true},
			id_app: access.id_app,
			origins: access.origins,
			lifespans: config.crypto.tokenLifespans,
			permissionsEngine: makePermissionsEngine({
				isPlatform: access.id_app === config.platform.appDetails.id_app,
				permissionsTables: tables.permissions,
			}),
			signToken,
			generateNickname,
		})

		await tables.user.latestLogin.update({
			...find({userId}),
			upsert: {userId, time: Date.now()},
		})

		return authTokens
	},

	// async authorizeAsUser(
	// 		{access, tables},
	// 		{scope, refreshToken}: {
	// 			scope: Scope
	// 			refreshToken: RefreshToken
	// 		}
	// 	) {
	// 	const {userId} = await verifyToken<RefreshPayload>(refreshToken)
	// 	const {user, permit} = await fetchUserAndPermit({
	// 		userId,
	// 		tables,
	// 		generateNickname,
	// 	})

	// 	await tables.user.latestLogin.update({
	// 		...find({userId}),
	// 		upsert: {userId, time: Date.now()},
	// 	})

	// 	return signToken<AccessPayload>({
	// 		lifespan: config.tokens.lifespans.access,
	// 		payload: {
	// 			user,
	// 			scope,
	// 			permit,
	// 			id_app: access.id_app,
	// 			origins: access.origins,
	// 		},
	// 	})
	// },
})
