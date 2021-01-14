
import {asTopic} from "renraku/x/identities/as-topic.js"

import {signAuthTokens} from "../topics/login/sign-auth-tokens.js"
import {assertEmailAccount} from "../topics/login/assert-email-account.js"
import {fetchUserAndPermit} from "../topics/login/fetch-user-and-permit.js"
import {AnonAuth, AccessPayload, LoginPayload, RefreshPayload, RefreshToken, Scope, AuthOptions} from "../auth-types.js"

export const loginTopic = ({
		rando,
		config,
		signToken,
		verifyToken,
		sendLoginEmail,
		generateNickname,
	}: AuthOptions) => asTopic<AnonAuth>()({

	async sendLoginLink(
			{app, tables},
			{email}: {email: string},
		) {
		const {userId} = await assertEmailAccount({rando, email, config, tables})
		await sendLoginEmail({
			app,
			to: email,
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
		return signAuthTokens({
			userId,
			tables,
			scope: {core: true},
			lifespans: config.tokens.lifespans,
			signToken,
			generateNickname,
		})
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
		return signToken<AccessPayload>({
			payload: {user, scope, permit},
			lifespan: config.tokens.lifespans.access,
		})
	},
})
