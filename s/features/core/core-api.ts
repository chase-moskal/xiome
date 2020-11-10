
import {processPayloadTopic as topic} from "renraku/dist/curries.js"

import {Rando} from "../../toolbox/get-rando.js"
import {concurrent} from "../../toolbox/concurrent.js"
import {ConstrainTables} from "../../toolbox/dbby/dbby-types.js"

import {prepareAuthProcessors} from "./auth-processors.js"
import {prepareAuthTools} from "./authtools/neato.js"
import {CoreTables, VerifyToken, VerifyGoogleToken, SignToken, RefreshToken, Scope, AccessPayload, PlatformConfig, RefreshPayload} from "./core-types.js"

export function makeCoreApi({
		rando,
		config,
		signToken,
		verifyToken,
		constrainTables,
		verifyGoogleToken,
	}: {
		rando: Rando
		signToken: SignToken
		config: PlatformConfig
		verifyToken: VerifyToken
		verifyGoogleToken: VerifyGoogleToken
		constrainTables: ConstrainTables<CoreTables>
	}) {

	const {
		authForApp,
		authForUser,
		authForRootUser,
	} = prepareAuthProcessors<CoreTables>({
		verifyToken,
		constrainTables,
	})

	return {

		authTopic2: topic(authForApp, {
			async authenticateViaPasskey({app, tables}, {passkey}: {passkey: string}) {
				const tools = prepareAuthTools2({rando, tables})
				const {userId} = await tools.assertPasskeyAccount(passkey)
				return tools.signAuthTokens({
					userId,
					scope: {core: true},
					lifespans: config.tokens.lifespans,
				})
			},
			async authenticateViaGoogle({app, tables}, {googleToken}: {googleToken: string}) {
				const tools = prepareAuthTools2({rando, tables})
				const {userId} = await tools.assertGoogleAccount(googleToken)
				return tools.signAuthTokens({
					userId,
					scope: {core: true},
					lifespans: config.tokens.lifespans,
				})
			},
			async authorize({app, tables}, {refreshToken, scope}: {refreshToken: RefreshToken, scope: Scope}) {
				const tools = prepareAuthTools2({rando, tables})
				const {userId} = await verifyToken<RefreshPayload>(refreshToken)
				const {user, permit} = await concurrent({
					user: await tools.fetchUser(userId),
					permit: await tools.findPermitFor(userId),
				})
				return signToken<AccessPayload>({
					payload: {
						user,
						scope,
						permit,
					},
					lifespan: config.tokens.lifespans.access,
				})
			},
		}),

		authTopic: topic(authForApp, {
			async authenticateViaPasskey({app, tables}, {passkey}: {passkey: string}) {
				return {
					accessToken: true,
					refreshToken: true,
				}
			},
			async authenticateViaGoogle({app, tables}, {googleToken}: {googleToken: string}) {
				const tools = prepareAuthTools({rando, tables})
				const {googleId, avatar: googleAvatar, name} = await verifyGoogleToken(googleToken)
				const accountViaGoogle = await tools.findAccountViaGoogle(googleId)
				const account = accountViaGoogle
					? await tools.findAccount(accountViaGoogle.userId)
					: await tools.registerViaGoogle({googleId, googleAvatar})
				const user = await tools.findUser(account.userId)
				const permit = await tools.findPermitFor(account.userId)
				const scope: Scope = {core: true}
				return concurrent({
					accessToken: signToken<AccessPayload>({
						payload: {user, permit, scope},
						lifespan: config.tokens.lifespans.access,
					}),
					refreshToken: signToken<RefreshPayload>({
						payload: {userId: user.userId},
						lifespan: config.tokens.lifespans.refresh,
					}),
				})
			},
			async authorize({app, tables}, {refreshToken, scope}: {refreshToken: RefreshToken, scope: Scope}) {
				// const {userId} = await verifyToken<RefreshPayload>(refreshToken)
				// const user = await userLogin(userId)
				// return signToken<AccessPayload>({
				// 	payload: {user, scope},
				// 	lifespan: accessTokenLifespan,
				// })
				return ""
			},
		}),

		// appsTopic: authProcessor.authForRootUser({
		// 	async listApps({app, access, tables}, o: {
		// 			userId: string
		// 		}) {},
		// 	async registerApp({app, access, tables}, o: {
		// 			userId: string
		// 			appDraft: any
		// 		}) {},
		// 	async deleteApp({app, access, tables}, o: {
		// 			userId: string
		// 			appId: string
		// 		}) {},
		// 	async createAppToken({app, access, tables}, o: {
		// 			userId: string
		// 			appId: string
		// 			appTokenDraft: any
		// 		}) {},
		// 	async deleteAppToken({app, access, tables}, o: {
		// 			userId: string
		// 			appTokenId: string
		// 		}) {},
		// }),

		// userTopic: authProcessor.authForUser({
		// 	async getUser({app, access, tables}, {userId}: {userId: string}) {
		// 		// return fetchUser(userId)
		// 	},
		// 	async setUserProfile({app, access, tables}, {userId, profile}: {userId: string, profile: Profile}) {
		// 		// const askingUser = await verifyScope(accessToken)
		// 		// const allowed = false
		// 		// 	|| askingUser.claims.admin
		// 		// 	|| askingUser.userId === userId
		// 		// if (!allowed) throw new Error("forbidden")
		// 		// const {problems} = validateProfile(profile)
		// 		// if (problems.length) throw new Error(`invalid profile: ${problems.join("; ")}`)
		// 		// await profileTable.update({
		// 		// 	conditions: and({equal: {userId}}),
		// 		// 	write: profile,
		// 		// })
		// 	},
		// }),
	}
}









	// async function verifyScope(accessToken: AccessToken): Promise<User> {
	// 	const {user, scope} = await verifyToken<AccessPayload>(accessToken)
	// 	if (!scope.core) throw new Error("forbidden scope")
	// 	return user
	// }

	// function assembleUser({
	// 		accountRow,
	// 		claimsRow,
	// 		profileRow,
	// 	}: {
	// 		accountRow: AccountRow
	// 		claimsRow: ClaimsRow
	// 		profileRow: ProfileRow
	// 	}) {
	// 	const {userId: noop1, ...claims} = claimsRow
	// 	const {userId: noop2, ...profile} = profileRow
	// 	const {userId} = accountRow
	// 	return <U>{userId, claims, profile}
	// }

	// async function fetchUser(userId: string): Promise<U> {
	// 	const userIdConditions = {conditions: and({equal: {userId}})}
	// 	const accountRow = await accountTable.one(userIdConditions)
	// 	return assembleUser({
	// 		accountRow,
	// 		...await concurrent({
	// 			claimsRow: claimsTable.one(userIdConditions),
	// 			profileRow: profileTable.one(userIdConditions),
	// 		}),
	// 	})
	// }

	// async function assertUser({avatar, accountRow}: {
	// 		avatar: string
	// 		accountRow: AccountRow
	// 	}) {
	// 	const {userId} = accountRow
	// 	const userIdConditions = {conditions: and({equal: {userId}})}
	// 	return assembleUser({
	// 		accountRow,
	// 		...await concurrent({
	// 			claimsRow: claimsTable.assert({
	// 				...userIdConditions,
	// 				make: async() => ({
	// 					userId,
	// 					admin: false,
	// 					staff: false,
	// 					joined: Date.now(),
	// 					banUntil: undefined,
	// 					banReason: undefined,
	// 					premiumUntil: undefined,
	// 				}),
	// 			}),
	// 			profileRow: profileTable.assert({
	// 				...userIdConditions,
	// 				make: async() => ({
	// 					userId,
	// 					avatar,
	// 					tagline: "",
	// 					nickname: generateNickname(),
	// 				}),
	// 			}),
	// 		}),
	// 	})
	// }

	// async function updateClaims(
	// 		userId: string,
	// 		claims: Partial<U["claims"]>
	// 	) {
	// 	await claimsTable.update({
	// 		conditions: and({equal: {userId}}),
	// 		write: claims,
	// 	})
	// }

	// async function userLogin(userId: string) {
	// 	const user = await fetchUser(userId)
	// 	const claims = {...user.claims}
	// 	await updateClaims(userId, claims)
	// 	user.claims = claims
	// 	return user
	// }
