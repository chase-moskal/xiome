
import {apiContext} from "renraku/x/api/api-context.js"

import {AppsApiOptions} from "../types/apps-api-options.js"
import {AppsAuth, AppsMeta} from "../types/apps-meta-and-auth.js"
import {manageAppsPolicy} from "../policies/manage-apps-policy.js"
import {AppDraft} from "../types/business/app-draft.js"

export const manageApps =
	(options: AppsApiOptions) => apiContext<AppsMeta, AppsAuth>()({
	policy: manageAppsPolicy(options),
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
