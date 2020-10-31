
import {processPayloadTopic} from "renraku/dist/curries.js"

import {prepareAuthProcessors} from "./auth-processor.js"
import {ConstrainTables} from "../../toolbox/dbby/dbby-types.js"
import {AuthTables, VerifyToken, SignToken, RefreshToken, Scope} from "./core-types.js"

export function makeCoreApi({verifyToken, signToken, constrainTables}: {
		signToken: SignToken
		verifyToken: VerifyToken
		constrainTables: ConstrainTables<AuthTables>
	}) {

	const authProcessor = prepareAuthProcessors<AuthTables>({
		verifyToken,
		constrainTables,
	})

	return {
		authTopic: processPayloadTopic(authProcessor.authForApp, ({
			async authenticateViaPasskey({app, tables}, {passkey}: {passkey: string}) {
				tables.account
				// lol authn
			},
			async authenticateViaGoogle({app, tables}, {googleToken}: {googleToken: string}) {
				// const {googleId, avatar, name} = await verifyGoogleToken(googleToken)
				// const accountRow = await accountTable.assert({
				// 	conditions: and({equal: {googleId}}),
				// 	make: async() => ({
				// 		userId: generateId(),
				// 		googleId,
				// 		googleAvatar: avatar,
				// 	}),
				// })
				// const user = await assertUser({accountRow, avatar})
				// return concurrent({
				// 	accessToken: signToken<AccessPayload>({
				// 		payload: {user, scope: {core: true}},
				// 		lifespan: accessTokenLifespan,
				// 	}),
				// 	refreshToken: signToken<RefreshPayload>({
				// 		payload: {userId: accountRow.userId},
				// 		lifespan: refreshTokenLifespan,
				// 	}),
				// })
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
		})),

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
