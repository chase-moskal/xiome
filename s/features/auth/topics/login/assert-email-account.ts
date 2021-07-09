
import {Rando} from "../../../../toolbox/get-rando.js"
import {AuthTables} from "../../tables/types/auth-tables.js"
import {generateAccountRow} from "./generate-account-row.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {initializeUserProfile} from "./user/profile/initialize-user-profile.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {universalPermissions} from "../../../../assembly/backend/permissions2/standard-permissions.js"

const standardRoleIds = {
	anonymous: universalPermissions.roles.anonymous.id_role,
	authenticated: universalPermissions.roles.authenticated.id_role,
	technician: universalPermissions.roles.technician.id_role,
}

export async function assertEmailAccount({
		rando, email, tables, config, generateNickname,
	}: {
		rando: Rando
		email: string
		tables: AuthTables
		config: SecretConfig
		generateNickname: () => string
	}) {

	const {id_user} = await tables.user.accountViaEmail.assert({
		...find({email}),
		make: async function makeNewAccountViaEmail() {
			const isTechnician = email === config.platform.technician.email
			const account = generateAccountRow({rando})
			const {id_user} = account

			console.log("GENERATE NEW USER", id_user)

			const createAccount = tables.user.account.create(account)

			const createProfile = initializeUserProfile({
				id_user,
				email,
				authTables: tables,
				generateNickname,
			})

			const assignAnonymous = tables.permissions.userHasRole.create({
				id_user,
				hard: true,
				public: false,
				id_role: standardRoleIds.anonymous,
				timeframeEnd: undefined,
				timeframeStart: undefined,
			})

			const assignAuthenticated = tables.permissions.userHasRole.create({
				id_user,
				hard: true,
				public: false,
				id_role: standardRoleIds.authenticated,
				timeframeEnd: undefined,
				timeframeStart: undefined,
			})

			const assignTechnician = isTechnician
				? tables.permissions.userHasRole.create({
					id_user,
					hard: true,
					public: true,
					timeframeEnd: undefined,
					id_role: standardRoleIds.technician,
					timeframeStart: undefined,
				})
				: Promise.resolve()

			await Promise.all([
				createAccount,
				createProfile,
				assignAnonymous,
				assignAuthenticated,
				assignTechnician,
			])

			return {email, id_user}
		},
	})

	return {id_user}
}
