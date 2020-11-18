
import {processPayloadTopic as processAuth} from "renraku/dist/curries.js"

import {Rando} from "../../../toolbox/get-rando.js"
import {ConstrainTables} from "../../../toolbox/dbby/dbby-types.js"
import {CoreTables, VerifyToken, SignToken, RefreshToken, Scope, AccessPayload, PlatformConfig, RefreshPayload, SendEmail, LoginPayload} from "../auth-types.js"

import {signAuthTokens} from "./login/sign-auth-tokens.js"
import {assertEmailAccount} from "./login/assert-email-account.js"
import {fetchUserAndPermit} from "./login/fetch-user-and-permit.js"
import {prepareAnonOnAnyApp} from "./auth-processors/anon-on-any-app.js"

export function makeLoginTopic({
			rando,
			config,
			signToken,
			sendEmail,
			verifyToken,
			constrainTables,
			generateNickname,
		}: {
			rando: Rando
			signToken: SignToken
			sendEmail: SendEmail
			config: PlatformConfig
			verifyToken: VerifyToken
			generateNickname: () => string
			constrainTables: ConstrainTables<CoreTables>
		}) {
	return processAuth(prepareAnonOnAnyApp({verifyToken, constrainTables}), {

		async sendLoginLink(
					{app, tables},
					{email}: {email: string},
				) {
			const {userId} = await assertEmailAccount({rando, email, tables})
			const loginToken = await signToken<LoginPayload>({
				payload: {userId},
				lifespan: config.tokens.lifespans.login,
			})
			// TODO refactor hardcoded email!
			await sendEmail({
				to: email,
				subject: `Login to ${app.label}`,
				body: `Login with this link: https://auth.feature.farm/login#${loginToken}`
					+ `\n\nIf you did not request this login link, just ignore it`
					+ `\n\nYou can reply to get in touch with support`
					+ `\n\n    - Feature.farm support staff`,
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
			const {user, permit} = await fetchUserAndPermit({userId, tables, generateNickname})
			return signToken<AccessPayload>({
				payload: {user, scope, permit},
				lifespan: config.tokens.lifespans.access,
			})
		},
	})
}
