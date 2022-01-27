
import * as renraku from "renraku"
import {Id, find} from "dbmage"

import {AppDraft} from "../types/app-draft.js"
import {appointAdmin} from "../utils/appoint-admin.js"
import {AuthOptions} from "../../../types/auth-options.js"
import {validateAppDraft} from "../utils/validate-app-draft.js"
import {emailValidator} from "../utils/admin-email-validator.js"
import {AdminEmailDisplay} from "../types/admin-email-display.js"
import {originsToDatabase} from "../../../utils/origins-to-database.js"
import {throwProblems} from "../../../../../toolbox/topic-validation/throw-problems.js"
import {appPermissions} from "../../../../../assembly/backend/permissions/standard-permissions.js"

const adminRoleId = Id.fromString(appPermissions.roles.admin.roleId)

export const makeAppEditService = ({
	rando, config, authPolicies, generateNickname,
}: AuthOptions) => renraku.service()

.policy(authPolicies.appOwnerPolicy)

.expose(({database, authorizeAppOwner}) => ({

	async updateApp({appId: appIdString, appDraft}: {
			appId: string
			appDraft: AppDraft
		}) {
		throwProblems(validateAppDraft(appDraft))
		const appId = Id.fromString(appIdString)

		await authorizeAppOwner(appId)

		await database.tables.apps.registrations.update({
			...find({appId}),
			whole: {
				appId,
				home: appDraft.home,
				label: appDraft.label,
				origins: originsToDatabase(appDraft.origins),
				archived: false,
			},
		})
	},

	async deleteApp({appId: appIdString}: {
			appId: string
		}) {
		const appId = Id.fromString(appIdString)
		await authorizeAppOwner(appId)
		await database.tables.apps.registrations.update({
			...find({appId}),
			write: {archived: true},
		})
	},

	async listAdmins({appId: appIdString}: {
			appId: string
		}): Promise<AdminEmailDisplay[]> {
		const appId = Id.fromString(appIdString)

		const databaseForApp = await authorizeAppOwner(appId)

		const usersWithAdminRole = await databaseForApp
			.tables.auth.permissions.userHasRole
				.read(find({roleId: adminRoleId}))

		const adminsViaEmail = await databaseForApp.tables.auth.users.emails
			.read(find(...usersWithAdminRole.map(({userId}) => ({userId}))))

		return adminsViaEmail.map(({userId, email}) => ({
			userId: userId.toString(),
			email,
		}))
	},

	async assignPlatformUserAsAdmin(
			{appId: appIdString, platformUserId: platformUserIdString}: {
				appId: string
				platformUserId: string
			}
		) {
		const appId = Id.fromString(appIdString)
		const databaseForApp = await authorizeAppOwner(appId)
		const platformUserId = Id.fromString(platformUserIdString)

		const platformAccount = await database.tables.auth.users.emails
			.readOne(find({userId: platformUserId}))

		if (!platformAccount)
			throw new renraku.ApiError(404, "platform email account not found")

		const {email} = platformAccount
		await appointAdmin({
			rando,
			config,
			email,
			databaseForApp,
			generateNickname,
		})
	},

	async assignAdmin({appId: appIdString, email}: {
			appId: string
			email: string
		}): Promise<void> {

		const appId = Id.fromString(appIdString)
		const databaseForApp = await authorizeAppOwner(appId)
		const problems = emailValidator(email)

		if (problems.length)
			throw new renraku.ApiError(400, "email failed validation: " + problems.join(";"))

		await appointAdmin({
			rando,
			config,
			email: email.toLowerCase(),
			databaseForApp,
			generateNickname,
		})
	},

	async revokeAdmin({appId: appIdString, userId: userIdString}: {
			appId: string
			userId: string
		}): Promise<void> {

		const appId = Id.fromString(appIdString)
		const userId = Id.fromString(userIdString)
		const databaseForApp = await authorizeAppOwner(appId)

		await databaseForApp.tables.auth.permissions.userHasRole.delete(find({
			userId,
			roleId: adminRoleId,
		}))
	},
}))
