
import {asTopic} from "renraku/x/identities/as-topic.js"

import {signAuthTokens} from "./login/sign-auth-tokens.js"
import {assertEmailAccount} from "./login/assert-email-account.js"
import {fetchUserAndPermit} from "./login/fetch-user-and-permit.js"
import {AnonAuth, AccessPayload, LoginPayload, RefreshPayload, RefreshToken, Scope, AuthOptions, AppRow} from "../auth-types.js"
import {find} from "../../../toolbox/dbby/dbby-mongo.js"

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
		const appRow: AppRow = app.platform
			? {
				home: config.platform.appDetails.home,
				appId: config.platform.appDetails.appId,
				label: config.platform.appDetails.label,
				archived: false,
			}
			: await tables.app.one(find({appId: app.appId}))
		const {userId} = await assertEmailAccount({rando, email, config, tables})
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
