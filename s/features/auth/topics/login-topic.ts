

import {asTopic} from "renraku/x/identities/as-topic.js"

import {AnonAuth} from "../policies/types/anon-auth.js"
import {find} from "../../../toolbox/dbby/dbby-mongo.js"
import {signAuthTokens} from "./login/sign-auth-tokens.js"
import {AuthApiOptions} from "../types/auth-api-options.js"
import {LoginPayload} from "../types/tokens/login-payload.js"
import {assertEmailAccount} from "./login/assert-email-account.js"

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
		const appRow = await tables.app.app.one(find({appId: access.appId}))
		const {userId} = await assertEmailAccount({
			rando, email, config, tables,
		})
		await sendLoginEmail({
			appHome: appRow.home,
			appLabel: appRow.label,
			to: email,
			platformLink: config.platform.appDetails.home,
			lifespan: config.tokens.lifespans.login,
			loginToken: await signToken<LoginPayload>({
				payload: {userId},
				lifespan: config.tokens.lifespans.login,
			}),
		})
	},

	async authenticateViaLoginToken(
			{tables, access},
			{loginToken}: {loginToken: string},
		) {
		const {userId} = await verifyToken<LoginPayload>(loginToken)
		const authTokens = await signAuthTokens({
			userId,
			tables,
			scope: {core: true},
			appId: access.appId,
			origins: access.origins,
			lifespans: config.tokens.lifespans,
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
	// 			appId: access.appId,
	// 			origins: access.origins,
	// 		},
	// 	})
	// },
})
