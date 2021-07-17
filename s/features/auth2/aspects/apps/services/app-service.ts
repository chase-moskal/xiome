
import {apiContext} from "renraku/x/api/api-context.js"

import {AppDraft} from "../types/business/app-draft.js"
import {CommonAuthOptions} from "../../../types/auth-options.js"
import {AppsAuth, AppsMeta} from "../types/apps-meta-and-auth.js"
import {appsManagerPolicy} from "../policies/manage-apps-policy.js"

export const appService =
	(options: CommonAuthOptions) => apiContext<AppsMeta, AppsAuth>()({
	policy: appsManagerPolicy(options),
	expose: {

		async listApps(
			{appTables, statsHub},
			{ownerUserId: ownerUserIdString}: {
				ownerUserId: string
			}) {
			throw new Error("TODO implement")
		},

		async registerApp(
				{appTables},
				{appDraft, ownerUserId: ownerUserIdString}: {
					appDraft: AppDraft
					ownerUserId: string
				}
			) {
			throw new Error("TODO implement")
		},

		async updateApp(
				{appTables},
				{appDraft, appId: appIdString}: {
					appDraft: AppDraft
					appId: string
				}
			) {
			throw new Error("TODO implement")
		},

		async deleteApp(
				{appTables},
				{appDraft, appId: appIdString}: {
					appDraft: AppDraft
					appId: string
				}
			) {
			throw new Error("TODO implement")
		},
	},
})
