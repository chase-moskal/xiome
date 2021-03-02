
import {ApiError} from "renraku/x/api/api-error.js"
import {asTopic} from "renraku/x/identities/as-topic.js"

import {AuthApiOptions} from "../types/auth-api-options.js"
import {find} from "../../../toolbox/dbby/dbby-helpers.js"
import {emailValidator} from "./apps/admin-email-validator.js"
import {AppOwnerAuth} from "../policies/types/app-owner-auth.js"
import {assertEmailAccount} from "./login/assert-email-account.js"
import {adminRoleId} from "../permissions/standard/build/ids/hard-role-ids.js"
import {AdminEmailDisplay} from "../types/manage-admins/admin-email-display.js"

export const manageAdminsTopic = ({
			rando,
			config,
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

	async assignAdmin(auth, {appId, email}: {
				appId: string
				email: string
			}): Promise<void> {

		const tablesForApp = await auth.getTablesNamespacedForApp(appId)
		const problems = emailValidator(email)

		if (problems.length)
			throw new ApiError(400, "email failed validation: " + problems.join(";"))

		const {userId: adminUserId} = await assertEmailAccount({
			rando,
			email,
			config,
			tables: tablesForApp,
		})

		await tablesForApp.permissions.userHasRole.assert({
			...find({userId: adminUserId, roleId: adminRoleId}),
			make: async() => ({
				userId: adminUserId,
				roleId: adminRoleId,
				hard: false,
				public: true,
				timeframeEnd: undefined,
				timeframeStart: undefined,
			})
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
