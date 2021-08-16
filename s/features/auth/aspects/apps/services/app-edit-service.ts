
import {ApiError} from "renraku/x/api/api-error.js"
import {apiContext} from "renraku/x/api/api-context.js"

import {AppDraft} from "../types/app-draft.js"
import {appointAdmin} from "../utils/appoint-admin.js"
import {AuthOptions} from "../../../types/auth-options.js"
import {validateAppDraft} from "../utils/validate-app-draft.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {find} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {emailValidator} from "../utils/admin-email-validator.js"
import {AdminEmailDisplay} from "../types/admin-email-display.js"
import {originsToDatabase} from "../../../utils/origins-to-database.js"
import {AppOwnerAuth, AppOwnerMeta} from "../../../types/auth-metas.js"
import {throwProblems} from "../../../../../toolbox/topic-validation/throw-problems.js"
import {appPermissions} from "../../../../../assembly/backend/permissions/standard-permissions.js"

const adminRoleId = DamnId.fromString(appPermissions.roles.admin.roleId)

export const makeAppEditService = ({
		rando, config, authPolicies, generateNickname,
	}: AuthOptions) => apiContext<AppOwnerMeta, AppOwnerAuth>()({
	policy: authPolicies.appOwnerPolicy,
	expose: {

		async updateApp({appTables, authorizeAppOwner}, {appId: appIdString, appDraft}: {
				appId: string
				appDraft: AppDraft
			}) {
			throwProblems(validateAppDraft(appDraft))
			const appId = DamnId.fromString(appIdString)

			await authorizeAppOwner(appId)

			await appTables.registrations.update({
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

		async deleteApp({appTables, authorizeAppOwner}, {appId: appIdString}: {
				appId: string
			}) {
			const appId = DamnId.fromString(appIdString)
			await authorizeAppOwner(appId)
			await appTables.registrations.update({
				...find({appId}),
				write: {archived: true},
			})
		},

		async listAdmins({authorizeAppOwner}, {appId: appIdString}: {
				appId: string
			}): Promise<AdminEmailDisplay[]> {
			const appId = DamnId.fromString(appIdString)

			const {authTables} = await authorizeAppOwner(appId)

			const usersWithAdminRole = await authTables.permissions.userHasRole
				.read(find({roleId: adminRoleId}))

			const adminsViaEmail = await authTables.users.emails
				.read(find(...usersWithAdminRole.map(({userId}) => ({userId}))))

			return adminsViaEmail.map(({userId, email}) => ({
				userId: userId.toString(),
				email,
			}))
		},

		async assignPlatformUserAsAdmin(
				{authTablesForPlatform, authorizeAppOwner},
				{appId: appIdString, platformUserId: platformUserIdString}: {
					appId: string
					platformUserId: string
				}
			) {
			const appId = DamnId.fromString(appIdString)
			const {authTables} = await authorizeAppOwner(appId)
			const platformUserId = DamnId.fromString(platformUserIdString)

			const platformAccount = await authTablesForPlatform.users.emails
				.one(find({userId: platformUserId}))

			if (!platformAccount)
				throw new ApiError(404, "platform email account not found")

			const {email} = platformAccount
			await appointAdmin({
				rando,
				config,
				email,
				authTables,
				generateNickname,
			})
		},

		async assignAdmin({authorizeAppOwner}, {appId: appIdString, email}: {
				appId: string
				email: string
			}): Promise<void> {

			const appId = DamnId.fromString(appIdString)
			const {authTables} = await authorizeAppOwner(appId)
			const problems = emailValidator(email)

			if (problems.length)
				throw new ApiError(400, "email failed validation: " + problems.join(";"))

			await appointAdmin({
				rando,
				config,
				email: email.toLowerCase(),
				authTables,
				generateNickname,
			})
		},

		async revokeAdmin({authorizeAppOwner}, {appId: appIdString, userId: userIdString}: {
				appId: string
				userId: string
			}): Promise<void> {

			const appId = DamnId.fromString(appIdString)
			const userId = DamnId.fromString(userIdString)
			const {authTables} = await authorizeAppOwner(appId)

			await authTables.permissions.userHasRole.delete(find({
				userId,
				roleId: adminRoleId,
			}))
		},
	},
})
