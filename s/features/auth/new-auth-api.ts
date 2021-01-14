
import {ApiError} from "renraku/x/api/api-error.js"
import {asApi} from "renraku/x/identities/as-api.js"
import {apiContext} from "renraku/x/api/api-context.js"
import {asTopic} from "renraku/x/identities/as-topic.js"
import {Policy} from "renraku/x/types/primitives/policy.js"

import {SignToken, VerifyToken} from "redcrypto/dist/types.js"

import {AccessPayload, AccessToken, AppPayload, AppToken, AuthTables, GetTables, LoginPayload, PlatformConfig, RefreshPayload, RefreshToken, Scope, SendLoginEmail} from "./auth-types.js"
import { Rando } from "../../toolbox/get-rando.js"
import { assertEmailAccount } from "./topics/login/assert-email-account.js"
import { signAuthTokens } from "./topics/login/sign-auth-tokens.js"
import { fetchUserAndPermit } from "./topics/login/fetch-user-and-permit.js"

export interface AnonMeta {
	appToken: AppToken
}
export interface AnonAuth {
	app: AppPayload
	tables: AuthTables
}

export interface UserMeta extends AnonMeta {
	accessToken: AccessToken
}
export interface UserAuth extends AnonAuth {
	access: AccessPayload
}

export interface PlatformUserMeta extends UserMeta {}
export interface PlatformUserAuth extends UserAuth {}

export function preparePolicies({verifyToken, getTables}: {
		verifyToken: VerifyToken
		getTables: GetTables<AuthTables>
	}) {

	const anon: Policy<AnonMeta, AnonAuth> = {
		processAuth: async({appToken}) => {
			const app = await verifyToken<AppPayload>(appToken)
			const tables = getTables({appId: app.appId})
			return {app, tables}
		},
	}

	const user: Policy<UserMeta, UserAuth> = {
		processAuth: async({accessToken, ...anonMeta}) => {
			const anonAuth = await anon.processAuth(anonMeta)
			const access = await verifyToken<AccessPayload>(accessToken)
			return {access, ...anonAuth}
		},
	}

	const platformUser: Policy<PlatformUserMeta, PlatformUserAuth> = {
		processAuth: async userMeta => {
			const userAuth = await user.processAuth(userMeta)
			if (!userAuth.app.platform)
				throw new ApiError(403, "forbiddden: only platform users allowed here")
			return userAuth
		},
	}

	return {anon, user, platformUser}
}

export interface AuthOptions {
	rando: Rando
	config: PlatformConfig
	signToken: SignToken
	verifyToken: VerifyToken
	sendLoginEmail: SendLoginEmail
	generateNickname: () => string
	getTables: GetTables<AuthTables>
}

export const loginTopic = ({
		rando,
		config,
		getTables,
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
					{app, tables},
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
			generateNickname,
		})
		return signToken<AccessPayload>({
			payload: {user, scope, permit},
			lifespan: config.tokens.lifespans.access,
		})
	},
})

export const createAuthApi = ({options, policies}: {
		options: AuthOptions
		policies: ReturnType<typeof preparePolicies>
	}) => asApi({

	login: apiContext<AnonMeta, AnonAuth>()({
		policy: policies.anon,
		expose: loginTopic(options),
	}),
})
