
import {Rando} from "../../../toolbox/get-rando.js"
import {and, or} from "../../../toolbox/dbby/dbby-helpers.js"
import {AccountRow, CoreTables, User, Permit} from "../core-types.js"

export function prepareAuthTools({rando, tables}: {
		rando: Rando
		tables: CoreTables
	}) {

	async function findAccountViaGoogle(googleId: string) {
		return tables.accountViaGoogle.one({
			conditions: and({equal: {googleId}})
		})
	}

	async function findAccount(userId: string) {
		return tables.account.one({
			conditions: and({equal: {userId}})
		})
	}

	async function registerViaGoogle({googleId, googleAvatar}: {
			googleId: string
			googleAvatar: string
		}) {
		const account: AccountRow = {
			userId: rando.randomId(),
			created: Date.now(),
		}
		await Promise.all([
			tables.account.create(account),
			tables.accountViaGoogle.create({
				googleId,
				googleAvatar,
				userId: account.userId,
			}),
		])
		return account
	}

	async function findUser(userId: string): Promise<User> {
		const profileRow = await tables.profile.one({
			conditions: and({equal: {userId}})
		})
		const tags = getTags()
		return undefined
		// return {
		// 	userId,
		// 	profile,
		// 	tags,
		// }
	}

	async function findPermitFor(userId: string): Promise<Permit> {
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
			privileges: privilegeRows.map(privilege => privilege.privilegeId)
		}
	}

	return {
		findAccountViaGoogle,
		findAccount,
		registerViaGoogle,
		findUser,
		findPermitFor,
	}
}

