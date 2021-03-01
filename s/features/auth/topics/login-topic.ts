
import {asTopic} from "renraku/x/identities/as-topic.js"

import {find} from "../../../toolbox/dbby/dbby-mongo.js"
import {signAuthTokens} from "./login/sign-auth-tokens.js"
import {assertEmailAccount} from "./login/assert-email-account.js"
import {fetchUserAndPermit} from "./login/fetch-user-and-permit.js"
import {RefreshPayload} from "../types/tokens/refresh-payload.js"
import {AccessPayload} from "../types/tokens/access-payload.js"
import {LoginPayload} from "../types/tokens/login-payload.js"
import {Scope} from "../types/tokens/scope.js"
import {RefreshToken} from "../types/tokens/refresh-token.js"
import {AnonAuth} from "../policies/types/anon-auth.js"
import {AuthApiOptions} from "../types/auth-api-options.js"

export const loginTopic = ({
		rando,
		config,
		signToken,
		verifyToken,
		sendLoginEmail,
		generateNickname,
	}: AuthApiOptions) => asTopic<AnonAuth>()({

	async sendLoginLink(
			{app, tables},
			{email}: {email: string},
		) {
		const appRow = await tables.app.app.one(find({appId: app.appId}))
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
			{tables},
			{loginToken}: {loginToken: string},
		) {
		const {userId} = await verifyToken<LoginPayload>(loginToken)
		const authTokens = await signAuthTokens({
			userId,
			tables,
			scope: {core: true},
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

	async authorize(
			{tables},
			{scope, refreshToken}: {
				scope: Scope
				refreshToken: RefreshToken
			}
		) {
		const {userId} = await verifyToken<RefreshPayload>(refreshToken)
		const {user, permit} = await fetchUserAndPermit({
			userId,
			tables,
			generateNickname,
		})

		await tables.user.latestLogin.update({
			...find({userId}),
			upsert: {userId, time: Date.now()},
		})

		return signToken<AccessPayload>({
			payload: {user, scope, permit},
			lifespan: config.tokens.lifespans.access,
		})
	},
})
