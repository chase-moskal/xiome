
import {Rando} from "../../../../toolbox/get-rando.js"
import {AuthTables} from "../../tables/types/auth-tables.js"
import {generateAccountRow} from "./generate-account-row.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {initializeUserProfile} from "./user/profile/initialize-user-profile.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {universalPermissions} from "../../../../assembly/backend/permissions2/standard-permissions.js"

const standardRoleIds = {
	anonymous: universalPermissions.roles.anonymous.roleId,
	authenticated: universalPermissions.roles.authenticated.roleId,
	technician: universalPermissions.roles.technician.roleId,
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

	const {userId} = await tables.user.accountViaEmail.assert({
		...find({email}),
		make: async function makeNewAccountViaEmail() {
			const isTechnician = email === config.platform.technician.email
			const account = generateAccountRow({rando})
			const {userId} = account

			const createAccount = tables.user.account.create(account)

			const createProfile = initializeUserProfile({
				userId,
				email,
				authTables: tables,
				generateNickname,
			})

			const assignAnonymous = tables.permissions.userHasRole.create({
				userId,
				hard: true,
				public: false,
				roleId: standardRoleIds.anonymous,
				timeframeEnd: undefined,
				timeframeStart: undefined,
			})

			const assignAuthenticated = tables.permissions.userHasRole.create({
				userId,
				hard: true,
				public: false,
				roleId: standardRoleIds.authenticated,
				timeframeEnd: undefined,
				timeframeStart: undefined,
			})

			const assignTechnician = isTechnician
				? tables.permissions.userHasRole.create({
					userId,
					hard: true,
					public: true,
					timeframeEnd: undefined,
					roleId: standardRoleIds.technician,
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

			return {email, userId}
		},
	})

	return {userId}
}
