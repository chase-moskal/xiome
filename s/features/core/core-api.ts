
import {processPayloadTopic} from "renraku/dist/curries.js"

import {DbbyTable, ConstrainTables} from "../../toolbox/dbby/dbby-types.js"

import {User, Profile, VerifyToken, SignToken, AccessToken, RefreshToken, Scope, AccessPayload, AppToken, AppPayload, AccountRow, AccountViaGoogleRow, AccountViaPasskeyRow} from "./core-types.js"

export function makeCoreApi({signToken, verifyToken, constrainTables}: {
		signToken: SignToken
		verifyToken: VerifyToken
		constrainTables: ConstrainTables<{
			account: DbbyTable<AccountRow>
			accountViaGoogle: DbbyTable<AccountViaGoogleRow>
			accountViaPasskey: DbbyTable<AccountViaPasskeyRow>
		}>
	}) {

	async function verifyScope(accessToken: AccessToken): Promise<User> {
		const {user, scope} = await verifyToken<AccessPayload>(accessToken)
		if (!scope.core) throw new Error("forbidden scope")
		return user
	}

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

	//
	// auth preprocessing for requests
	//

	const auth = (() => {
		const processAppToken = async({appToken}: {appToken: AppToken}) => {
			const app = await verifyToken<AppPayload>(appToken)
			return {
				app,

				// generate table handlers constrained to app namespace
				tables: constrainTables({appId: app.appId}),
			}
		}

		const processStandardAuth = async({appToken, accessToken}: {
				appToken: AppToken
				accessToken: AccessToken
			}) => ({
			...await processAppToken({appToken}),
			access: await verifyToken<AccessPayload>(accessToken),
		})

		async function processRootAuth(meta: {
				appToken: AppToken
				accessToken: AccessToken
			}) {
			const auth = await processStandardAuth(meta)
			if (!auth.app.root) throw new Error("apps topic is root-only")
			return auth
		}

		return {processAppToken, processStandardAuth, processRootAuth}
	})()

	//
	// auth api topics
	//

	return {
		appsTopic: processPayloadTopic(auth.processRootAuth, {
			async listApps({app, access, tables}, o: {
					userId: string
				}) {},
			async registerApp({app, access, tables}, o: {
					userId: string
					appDraft: any
				}) {},
			async deleteApp({app, access, tables}, o: {
					userId: string
					appId: string
				}) {},
			async createAppToken({app, access, tables}, o: {
					userId: string
					appId: string
					appTokenDraft: any
				}) {},
			async deleteAppToken({app, access, tables}, o: {
					userId: string
					appTokenId: string
				}) {},
		}),

		authTopic: processPayloadTopic(auth.processAppToken, {
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
		}),

		userTopic: processPayloadTopic(auth.processStandardAuth, {
			async getUser({app, access, tables}, {userId}: {userId: string}) {
				// return fetchUser(userId)
			},
			async setUserProfile({app, access, tables}, {userId, profile}: {userId: string, profile: Profile}) {
				// const askingUser = await verifyScope(accessToken)
				// const allowed = false
				// 	|| askingUser.claims.admin
				// 	|| askingUser.userId === userId
				// if (!allowed) throw new Error("forbidden")
				// const {problems} = validateProfile(profile)
				// if (problems.length) throw new Error(`invalid profile: ${problems.join("; ")}`)
				// await profileTable.update({
				// 	conditions: and({equal: {userId}}),
				// 	write: profile,
				// })
			},
		}),
	}
}
