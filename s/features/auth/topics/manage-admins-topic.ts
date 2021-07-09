
import {ApiError} from "renraku/x/api/api-error.js"
import {asTopic} from "renraku/x/identities/as-topic.js"

import {appointAdmin} from "./admins/appoint-admin.js"
import {find} from "../../../toolbox/dbby/dbby-helpers.js"
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

	async listAdmins(auth, {id_app}: {
				id_app: string
			}): Promise<AdminEmailDisplay[]> {

		const tablesForApp = await auth.getTablesNamespacedForApp(id_app)

		const usersWithAdminRole = await tablesForApp.permissions.userHasRole
			.read(find({id_role: adminRoleId}))

		const adminsViaEmail = await tablesForApp.user.accountViaEmail
			.read(find(...usersWithAdminRole.map(({id_user}) => ({id_user}))))

		return adminsViaEmail.map(({id_user: id_user, email}) => ({
			id_user,
			email,
		}))
	},

	async assignPlatformUserAsAdmin(auth, {id_app, platformUserId}: {
			id_app: string
			platformUserId: string
		}) {
		const tablesForPlatform = auth.tables
		const tablesForApp = await auth.getTablesNamespacedForApp(id_app)

		const platformAccount = await tablesForPlatform.user.accountViaEmail
			.one(find({id_user: platformUserId}))

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

	async assignAdmin(auth, {id_app, email}: {
				id_app: string
				email: string
			}): Promise<void> {

		const tablesForApp = await auth.getTablesNamespacedForApp(id_app)
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

	async revokeAdmin(auth, {id_app, id_user}: {
				id_app: string
				id_user: string
			}): Promise<void> {

		const tablesForApp = await auth.getTablesNamespacedForApp(id_app)

		await tablesForApp.permissions.userHasRole.delete(find({
			id_user,
			id_role: adminRoleId,
		}))
	},
})
