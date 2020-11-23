
import {processPayloadTopic as processAuth} from "renraku/dist/curries.js"

import {Rando} from "../../../toolbox/get-rando.js"
import {ConstrainTables} from "../../../toolbox/dbby/dbby-types.js"
import {AuthTables, VerifyToken, SignToken, RefreshToken, Scope, AccessPayload, PlatformConfig, RefreshPayload, LoginPayload, SendLoginEmail} from "../auth-types.js"

import {signAuthTokens} from "./login/sign-auth-tokens.js"
import {assertEmailAccount} from "./login/assert-email-account.js"
import {fetchUserAndPermit} from "./login/fetch-user-and-permit.js"
import {prepareAnonOnAnyApp} from "./auth-processors/anon-on-any-app.js"

export function makeLoginTopic({
			rando,
			config,
			signToken,
			verifyToken,
			sendLoginEmail,
			constrainTables,
			generateNickname,
		}: {
			rando: Rando
			config: PlatformConfig
			signToken: SignToken
			verifyToken: VerifyToken
			sendLoginEmail: SendLoginEmail
			generateNickname: () => string
			constrainTables: ConstrainTables<AuthTables>
		}) {
	return processAuth(prepareAnonOnAnyApp({verifyToken, constrainTables}), {

		async sendLoginLink(
					{app, tables},
					{email}: {email: string},
				) {
			const {userId} = await assertEmailAccount({rando, email, tables})
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
					{app, tables},
					{loginToken}: {loginToken: string},
				) {
			const {userId} = await verifyToken<LoginPayload>(loginToken)
			return signAuthTokens({
				userId,
				tables,
				scope: {core: true},
				lifespans: config.tokens.lifespans,
				hardPermissions: app.platform
					? config.permissions.platform
					: config.permissions.app,
				signToken,
				generateNickname,
			})
		},

		async authorize(
					{app, tables},
					{scope, refreshToken}: {
						scope: Scope
						refreshToken: RefreshToken
					}
				) {
			const {userId} = await verifyToken<RefreshPayload>(refreshToken)
			const {user, permit} = await fetchUserAndPermit({
				userId,
				tables,
				hardPermissions: app.platform
					? config.permissions.platform
					: config.permissions.app,
				generateNickname,
			})
			return signToken<AccessPayload>({
				payload: {user, scope, permit},
				lifespan: config.tokens.lifespans.access,
			})
		},
	})
}
