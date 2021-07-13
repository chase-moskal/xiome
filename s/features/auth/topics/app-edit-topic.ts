
import {asTopic} from "renraku/x/identities/as-topic.js"

import {AppDraft} from "../types/apps/app-draft.js"
import {find} from "../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {AuthApiOptions} from "../types/auth-api-options.js"
import {validateAppDraft} from "./apps/validate-app-draft.js"
import {AppOwnerAuth} from "../policies/types/app-owner-auth.js"
import {originsToDatabase} from "./origins/origins-to-database.js"
import {throwProblems} from "../../../toolbox/topic-validation/throw-problems.js"

export const appEditTopic = (options: AuthApiOptions) => asTopic<AppOwnerAuth>()({

	async updateApp({tables}, {appId: appIdString, appDraft}: {
			appId: string
			appDraft: AppDraft
		}) {
		throwProblems(validateAppDraft(appDraft))
		const appId = DamnId.fromString(appIdString)
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

	async deleteApp({tables}, {appId: appIdString}: {
			appId: string
		}) {
		const appId = DamnId.fromString(appIdString)
		await tables.app.app.update({
			...find({appId}),
			write: {archived: true},
		})
	},
})
