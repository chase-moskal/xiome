
import {asTopic} from "renraku/x/identities/as-topic.js"

import {AppDraft} from "../types/apps/app-draft.js"
import {throwProblems} from "../../../toolbox/topic-validation/throw-problems.js"
import {find} from "../../../toolbox/dbby/dbby-mongo.js"
import {AuthApiOptions} from "../types/auth-api-options.js"
import {validateAppDraft} from "./apps/validate-app-draft.js"
import {AppOwnerAuth} from "../policies/types/app-owner-auth.js"
import {originsToDatabase} from "./origins/origins-to-database.js"
import {requireUserIsAllowedToEditApp} from "./apps/require-user-is-allowed-to-edit-app.js"

export const appEditTopic = (options: AuthApiOptions) => asTopic<AppOwnerAuth>()({

	async updateApp({tables, access}, {appId, appDraft}: {
			appId: string
			appDraft: AppDraft
		}) {
		// await requireUserIsAllowedToEditApp({tables, access, appId})
		throwProblems(validateAppDraft(appDraft))
		await tables.app.app.update({
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

	async deleteApp({tables, access}, {appId}: {
			appId: string
		}) {
		// await requireUserIsAllowedToEditApp({tables, access, appId})
		await tables.app.app.update({
			...find({appId}),
			write: {archived: true},
		})
	},
})
