
import {apiContext} from "renraku/x/api/api-context.js"

import {CommonAuthOptions} from "../../../types/auth-options.js"
import {AppsAuth, AppsMeta} from "../types/apps-meta-and-auth.js"
import {appsManagerPolicy} from "../policies/manage-apps-policy.js"

export const adminService =
	(options: CommonAuthOptions) => apiContext<AppsMeta, AppsAuth>()({
	policy: appsManagerPolicy(options),
	expose: {

		async listAdmins(
				{appTables},
				{appId: appIdString}: {
					appId: string
				}
			) {
			throw new Error("TODO implement")
		},

		async assignPlatformUserAsAdmin(
				{appTables},
				{appId: appIdString, platformUserId: platformUserIdString}: {
					appId: string
					platformUserId: string
				}
			) {
			throw new Error("TODO implement")
		},

		async assignAdminByEmail(
				{appTables},
				{email, appId: appIdString}: {
					email: string
					appId: string
				}
			) {
			throw new Error("TODO implement")
		},

		async revokeAdmin(auth, {appId: appIdString, userId: userIdString}: {
				appId: string
				userId: string
			}) {
			throw new Error("TODO implement")
		},
	},
})
