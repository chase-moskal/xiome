
import {ApiError} from "renraku/x/api/api-error.js"
import {asTopic} from "renraku/x/identities/as-topic.js"

import {appointAdmin} from "./admins/appoint-admin.js"
import {find} from "../../../toolbox/dbby/dbby-helpers.js"
import {AuthApiOptions} from "../types/auth-api-options.js"
import {emailValidator} from "./apps/admin-email-validator.js"
import {AppOwnerAuth} from "../policies/types/app-owner-auth.js"
import {AdminEmailDisplay} from "../types/manage-admins/admin-email-display.js"
import {appPermissions} from "../../../assembly/backend/permissions2/standard-permissions.js"

const adminRoleId = appPermissions.roles.admin.roleId

export const manageAdminsTopic = ({
			rando,
			config,
			generateNickname,
		}: AuthApiOptions) => asTopic<AppOwnerAuth>()({

	async listAdmins(auth, {appId}: {
				appId: string
			}): Promise<AdminEmailDisplay[]> {

		const tablesForApp = await auth.getTablesNamespacedForApp(appId)

		const usersWithAdminRole = await tablesForApp.permissions.userHasRole
			.read(find({roleId: adminRoleId}))

		const adminsViaEmail = await tablesForApp.user.accountViaEmail
			.read(find(...usersWithAdminRole.map(({userId}) => ({userId}))))

		return adminsViaEmail.map(({userId, email}) => ({
			userId,
			email,
		}))
	},

	async assignPlatformUserAsAdmin(auth, {appId, platformUserId}: {
			appId: string
			platformUserId: string
		}) {
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

	async assignAdmin(auth, {appId, email}: {
				appId: string
				email: string
			}): Promise<void> {

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

	async revokeAdmin(auth, {appId, userId}: {
				appId: string
				userId: string
			}): Promise<void> {

		const tablesForApp = await auth.getTablesNamespacedForApp(appId)

		await tablesForApp.permissions.userHasRole.delete(find({
			userId,
			roleId: adminRoleId,
		}))
	},
})
