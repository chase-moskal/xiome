
import {AuthTables} from "../../../../types/auth-tables.js"
import {Rando} from "../../../../../../toolbox/get-rando.js"
import {generateAccountRow} from "./generate-account-row.js"
import {find} from "../../../../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../../../../toolbox/damnedb/damn-id.js"
import {initializeUserProfile} from "../profile/initialize-user-profile.js"
import {SecretConfig} from "../../../../../../assembly/backend/types/secret-config.js"
import {universalPermissions} from "../../../../../../assembly/backend/permissions/standard-permissions.js"

const standardRoleIds = {
	anonymous: universalPermissions.roles.anonymous.roleId,
	authenticated: universalPermissions.roles.authenticated.roleId,
	technician: universalPermissions.roles.technician.roleId,
}

export async function assertEmailAccount({
		rando, email, authTables, config, generateNickname,
	}: {
		rando: Rando
		email: string
		config: SecretConfig
		authTables: AuthTables
		generateNickname: () => string
	}) {

	email = email.toLowerCase()

	const accountViaEmail = await authTables.users.emails.assert({
		...find({email}),
		make: async function makeNewAccountViaEmail() {
			const isTechnician = email === config.platform.technician.email
			const account = generateAccountRow({rando})
			const {userId} = account

			const createAccount = authTables.users.accounts.create(account)

			const createProfile = initializeUserProfile({
				userId,
				email,
				authTables,
				generateNickname,
			})

			const assignAnonymous = authTables.permissions.userHasRole.create({
				userId,
				hard: true,
				public: false,
				roleId: DamnId.fromString(standardRoleIds.anonymous),
				timeframeEnd: undefined,
				timeframeStart: undefined,
			})

			const assignAuthenticated = authTables.permissions.userHasRole.create({
				userId,
				hard: true,
				public: false,
				roleId: DamnId.fromString(standardRoleIds.authenticated),
				timeframeEnd: undefined,
				timeframeStart: undefined,
			})

			const assignTechnician = isTechnician
				? authTables.permissions.userHasRole.create({
					userId,
					hard: true,
					public: true,
					timeframeEnd: undefined,
					roleId: DamnId.fromString(standardRoleIds.technician),
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

	return {userId: accountViaEmail.userId}
}
