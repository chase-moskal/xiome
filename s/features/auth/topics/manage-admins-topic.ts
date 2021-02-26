
import {ApiError} from "renraku/x/api/api-error.js"
import {asTopic} from "renraku/x/identities/as-topic.js"

import {AuthApiOptions} from "../auth-types.js"
import {find} from "../../../toolbox/dbby/dbby-helpers.js"
import {emailValidator} from "./apps/admin-email-validator.js"
import {assertEmailAccount} from "./login/assert-email-account.js"
import {adminRoleId} from "../permissions/standard/build/ids/hard-role-ids.js"
import {AdminEmailDisplay} from "../types/manage-admins/admin-email-display.js"
import {UnconstrainedPlatformUserAuth} from "../../../features/auth/auth-types.js"
import {requireUserIsAllowedToEditApp} from "./apps/require-user-is-allowed-to-edit-app.js"

export const manageAdminsTopic = ({
			rando,
			config,
		}: AuthApiOptions) => asTopic<UnconstrainedPlatformUserAuth>()({

	async listAdmins({
				access,
				appTables,
				namespaceAuthTables,
				namespacePermissionsTables,
			}, {appId}: {appId: string}): Promise<AdminEmailDisplay[]> {

		await requireUserIsAllowedToEditApp({appId, access, appTables})
		const authTables = namespaceAuthTables(appId)
		const permissionsTables = namespacePermissionsTables(appId)

		const usersWithAdminRole = await permissionsTables.userHasRole.read(find({
			roleId: adminRoleId
		}))
		const adminsViaEmail = await authTables.accountViaEmail.read(
			find(...usersWithAdminRole.map(({userId}) => ({userId})))
		)
		return adminsViaEmail.map(({userId, email}) => ({
			userId,
			email,
		}))
	},

	async assignAdmin({
				access,
				appTables,
				namespaceAuthTables,
				namespacePermissionsTables,
			}, {
				appId,
				email,
			}: {
				appId: string
				email: string
			}): Promise<void> {

		await requireUserIsAllowedToEditApp({appId, access, appTables})
		const authTables = namespaceAuthTables(appId)
		const permissionsTables = namespacePermissionsTables(appId)

		const problems = emailValidator(email)
		if (problems.length)
			throw new ApiError(400, "email failed validation: " + problems.join(";"))

		const {userId: adminUserId} = await assertEmailAccount({
			rando,
			config,
			email,
			authTables,
			permissionsTables,
		})
		await permissionsTables.userHasRole.assert({
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

	async revokeAdmin({
				access,
				appTables,
				namespacePermissionsTables,
			}, {
				appId,
				userId,
			}: {
				appId: string
				userId: string
			}): Promise<void> {

		await requireUserIsAllowedToEditApp({appId, access, appTables})
		const permissionsTables = namespacePermissionsTables(appId)
		await permissionsTables.userHasRole.delete(find({
			userId,
			roleId: adminRoleId,
		}))
	},
})
