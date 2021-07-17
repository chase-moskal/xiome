
import {apiContext} from "renraku/x/api/api-context.js"

import {AuthApiOptions} from "../../../types/auth-api-options.js"

export const appService =
	(options: AuthApiOptions) => apiContext<AppsMeta, AppsAuth>()({
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
