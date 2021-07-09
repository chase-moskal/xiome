
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

	async updateApp({tables, access}, {id_app, appDraft}: {
			id_app: string
			appDraft: AppDraft
		}) {
		// await requireUserIsAllowedToEditApp({tables, access, id_app})
		throwProblems(validateAppDraft(appDraft))
		await tables.app.app.update({
			...find({id_app}),
			whole: {
				id_app,
				home: appDraft.home,
				label: appDraft.label,
				origins: originsToDatabase(appDraft.origins),
				archived: false,
			},
		})
	},

	async deleteApp({tables, access}, {id_app}: {
			id_app: string
		}) {
		// await requireUserIsAllowedToEditApp({tables, access, id_app})
		await tables.app.app.update({
			...find({id_app}),
			write: {archived: true},
		})
	},
})
