
import {Rando} from "../../toolbox/get-rando.js"
import {concurrent} from "../../toolbox/concurrent.js"
import {and, or} from "../../toolbox/dbby/dbby-helpers.js"
import {AccountRow, SignToken, CoreTables, User, Permit, GoogleResult, Scope, AccessPayload, RefreshPayload, ProfileRow, Profile} from "./core-types.js"

export const prepareAuthTools = ({rando, signToken, generateNickname}: {
			rando: Rando
			signToken: SignToken
			generateNickname: () => string
		}) => function({tables}: {tables: CoreTables}) {

	function generateAccount(): AccountRow {
		return {
			userId: rando.randomId(),
			created: Date.now(),
		}
	}

	async function fetchUserTags(userId: string): Promise<string[]> {
		// TODO implement
		return []
	}

	const profileFromRow = ({
				avatar,
				tagline,
				nickname,
			}: ProfileRow): Profile => ({
		avatar,
		tagline,
		nickname,
	})

	const makeDefaultProfile = (userId: string) => ({
		userId,
		tagline: "",
		avatar: undefined,
		nickname: generateNickname(),
	})

	async function fetchUser(userId: string): Promise<User> {
		const {tags, profile} = await concurrent({
			tags: await fetchUserTags(userId),
			profile: profileFromRow(await tables.profile.assert({
				conditions: and({equal: {userId}}),
				make: async() => makeDefaultProfile(userId),
			})),
		})
		return {userId, tags, profile}
	}

	async function fetchPermit(userId: string): Promise<Permit> {
		const roleRows = await tables.userRole.read({
			conditions: and({equal: {userId}})
		})
		const privilegeRows = (
			await Promise.all(
				roleRows.map(({roleId}) => tables.rolePrivilege.read({
					conditions: or({equal: {roleId}})
				}))
			)
		).flat()
		return {
			roles: roleRows.map(role => role.roleId),
			privileges: privilegeRows.map(privilege => privilege.privilegeId),
		}
	}

	async function fetchUserAndPermit(userId: string) {
		return concurrent({
			user: await fetchUser(userId),
			permit: await fetchPermit(userId),
		})
	}

	async function assertPasskeyAccount(
				passkey: string
			): Promise<{userId: string}> {
		throw new Error("TODO implement")
	}

	async function assertGoogleAccount(
				{googleId, avatar}: GoogleResult
			): Promise<{userId: string}> {
		const accountViaGoogle = await tables.accountViaGoogle.one({
			conditions: and({equal: {googleId}}),
		})
		let account: AccountRow
		if (accountViaGoogle) {
			account = await tables.account.one({
				conditions: and({equal: {userId: accountViaGoogle.userId}}),
			})
		}
		else {
			account = generateAccount()
			await Promise.all([
				tables.account.create(account),
				tables.accountViaGoogle.create({
					googleId,
					googleAvatar: avatar,
					userId: account.userId,
				}),
			])
		}
		return account
	}

	async function signAuthTokens({scope, userId, lifespans}: {
				userId: string
				scope: Scope
				lifespans: {
					access: number
					refresh: number
				}
			}) {
		const {user, permit} = await concurrent({
			user: fetchUser(userId),
			permit: fetchPermit(userId),
		})
		return concurrent({
			accessToken: signToken<AccessPayload>({
				payload: {user, permit, scope},
				lifespan: lifespans.access,
			}),
			refreshToken: signToken<RefreshPayload>({
				payload: {userId: user.userId},
				lifespan: lifespans.refresh,
			}),
		})
	}

	return {
		signAuthTokens,
		fetchUserAndPermit,
		assertGoogleAccount,
		assertPasskeyAccount,
	}

	// async function findAccountViaGoogle(googleId: string) {
	// 	return tables.accountViaGoogle.one({
	// 		conditions: and({equal: {googleId}})
	// 	})
	// }

	// async function findAccount(userId: string) {
	// 	return tables.account.one({
	// 		conditions: and({equal: {userId}})
	// 	})
	// }

	// async function registerViaGoogle({googleId, googleAvatar}: {
	// 		googleId: string
	// 		googleAvatar: string
	// 	}) {
	// 	const account: AccountRow = {
	// 		userId: rando.randomId(),
	// 		created: Date.now(),
	// 	}
	// 	await Promise.all([
	// 		tables.account.create(account),
	// 		tables.accountViaGoogle.create({
	// 			googleId,
	// 			googleAvatar,
	// 			userId: account.userId,
	// 		}),
	// 	])
	// 	return account
	// }

	// async function findUser(userId: string): Promise<User> {
	// 	const profileRow = await tables.profile.one({
	// 		conditions: and({equal: {userId}})
	// 	})
	// 	const tags = getTags()
	// 	return undefined
	// 	// return {
	// 	// 	userId,
	// 	// 	profile,
	// 	// 	tags,
	// 	// }
	// }

	// async function findPermitFor(userId: string): Promise<Permit> {
	// 	const roleRows = await tables.userRole.read({
	// 		conditions: and({equal: {userId}})
	// 	})
	// 	const privilegeRows = (
	// 		await Promise.all(
	// 			roleRows.map(({roleId}) => tables.rolePrivilege.read({
	// 				conditions: or({equal: {roleId}})
	// 			}))
	// 		)
	// 	).flat()
	// 	return {
	// 		roles: roleRows.map(role => role.roleId),
	// 		privileges: privilegeRows.map(privilege => privilege.privilegeId)
	// 	}
	// }

	// return {
	// 	findAccountViaGoogle,
	// 	findAccount,
	// 	registerViaGoogle,
	// 	findUser,
	// 	findPermitFor,
	// }
}
