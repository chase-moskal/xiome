
import {ApiError} from "renraku/x/api/api-error.js"
import {asTopic} from "renraku/x/identities/as-topic.js"

import {appointAdmin} from "./admins/appoint-admin.js"
import {find} from "../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {AuthApiOptions} from "../types/auth-api-options.js"
import {emailValidator} from "./apps/admin-email-validator.js"
import {AppOwnerAuth} from "../policies/types/app-owner-auth.js"
import {AdminEmailDisplay} from "../types/manage-admins/admin-email-display.js"
import {appPermissions} from "../../../assembly/backend/permissions2/standard-permissions.js"

const adminRoleId = appPermissions.roles.admin.id_role

export const manageAdminsTopic = ({
			rando,
			config,
			generateNickname,
		}: AuthApiOptions) => asTopic<AppOwnerAuth>()({

	async listAdmins(auth, {appId: appIdString}: {
			appId: string
		}): Promise<AdminEmailDisplay[]> {

		const appId = DamnId.fromString(appIdString)
		const tablesForApp = await auth.getTablesNamespacedForApp(appId)

		const usersWithAdminRole = await tablesForApp.permissions.userHasRole
			.read(find({id_role: adminRoleId}))

		const adminsViaEmail = await tablesForApp.user.accountViaEmail
			.read(find(...usersWithAdminRole.map(({userId}) => ({userId}))))

		return adminsViaEmail.map(({userId, email}) => ({
			userId: userId.toString(),
			email,
		}))
	},

	async assignPlatformUserAsAdmin(
			auth,
			{appId: appIdString, platformUserId: platformUserIdString}: {
				appId: string
				platformUserId: string
			}
		) {
		const appId = DamnId.fromString(appIdString)
		const platformUserId = DamnId.fromString(platformUserIdString)
		const tablesForPlatform = auth.tables
		const tablesForApp = await auth.getTablesNamespacedForApp(appId)

		const platformAccount = await tablesForPlatform.user.accountViaEmail
			.one(find({userId: platformUserId}))

		if (!platformAccount)
			throw new ApiError(404, "platform email account not found")

		const {email} = platformAccount
		await appointAdmin({
			rando,
			config,
			email,
			tablesForApp,
			generateNickname,
		})
	},

	async assignAdmin(auth, {appId: appIdString, email}: {
			appId: string
			email: string
		}): Promise<void> {

		const appId = DamnId.fromString(appIdString)
		const tablesForApp = await auth.getTablesNamespacedForApp(appId)
		const problems = emailValidator(email)

		if (problems.length)
			throw new ApiError(400, "email failed validation: " + problems.join(";"))

		await appointAdmin({
			rando,
			config,
			email,
			tablesForApp,
			generateNickname,
		})
	},

	async revokeAdmin(auth, {appId: appIdString, userId: userIdString}: {
			appId: string
			userId: string
		}): Promise<void> {

		const appId = DamnId.fromString(appIdString)
		const userId = DamnId.fromString(userIdString)

		const tablesForApp = await auth.getTablesNamespacedForApp(appId)

		await tablesForApp.permissions.userHasRole.delete(find({
			userId,
			id_role: adminRoleId,
		}))
	},
})
