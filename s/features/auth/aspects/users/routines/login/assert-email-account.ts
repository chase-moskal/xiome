
import {Id, find, assert, RowFromTable} from "dbmage"

import {Rando} from "dbmage"
import {generateAccountRow} from "./generate-account-row.js"
import {initializeUserProfile} from "../profile/initialize-user-profile.js"
import {DatabaseSafe} from "../../../../../../assembly/backend/types/database.js"
import {SecretConfig} from "../../../../../../assembly/backend/types/secret-config.js"
import {universalPermissions} from "../../../../../../assembly/backend/permissions/standard-permissions.js"

const standardRoleIds = {
	everybody: universalPermissions.roles.everybody.roleId,
	authenticated: universalPermissions.roles.authenticated.roleId,
	technician: universalPermissions.roles.technician.roleId,
}

export async function assertEmailAccount({
		rando, email, databaseForApp, config, generateNickname,
	}: {
		rando: Rando
		email: string
		config: SecretConfig
		databaseForApp: DatabaseSafe
		generateNickname: () => string
	}) {

	email = email.toLowerCase()
	const authTables = databaseForApp.tables.auth

	const accountViaEmail = await assert<RowFromTable<typeof authTables.users.emails>>(
		authTables.users.emails,
		find({email}),
		async function makeNewAccountViaEmail() {
			const isTechnician = email === config.platform.technician.email
			const account = generateAccountRow({rando})
			const {userId} = account

			const createAccount = authTables.users.accounts.create(account)

			const createProfile = initializeUserProfile({
				userId,
				email,
				database: databaseForApp,
				generateNickname,
			})

			const assignEverybody = authTables.permissions.userHasRole.create({
				userId,
				hard: true,
				public: false,
				roleId: Id.fromString(standardRoleIds.everybody),
				timeframeEnd: undefined,
				timeframeStart: undefined,
				time: Date.now(),
			})

			const assignAuthenticated = authTables.permissions.userHasRole.create({
				userId,
				hard: true,
				public: false,
				roleId: Id.fromString(standardRoleIds.authenticated),
				timeframeEnd: undefined,
				timeframeStart: undefined,
				time: Date.now(),
			})

			const assignTechnician = isTechnician
				? authTables.permissions.userHasRole.create({
					userId,
					hard: true,
					public: true,
					timeframeEnd: undefined,
					roleId: Id.fromString(standardRoleIds.technician),
					timeframeStart: undefined,
					time: Date.now(),
				})
				: Promise.resolve()

			await Promise.all([
				createAccount,
				createProfile,
				assignEverybody,
				assignAuthenticated,
				assignTechnician,
			])

			return {email, userId}
		},
	)

	return {userId: accountViaEmail.userId}
}
