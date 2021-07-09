
import {asTopic} from "renraku/x/identities/as-topic.js"

import {isPlatform} from "../tools/is-platform.js"
import {AppDraft} from "../types/apps/app-draft.js"
import {AppDisplay} from "../types/apps/app-display.js"
import {concurrent} from "../../../toolbox/concurrent.js"
import {AuthApiOptions} from "../types/auth-api-options.js"
import {validateAppDraft} from "./apps/validate-app-draft.js"
import {originsToDatabase} from "./origins/origins-to-database.js"
import {and, find, or} from "../../../toolbox/dbby/dbby-helpers.js"
import {originsFromDatabase} from "./origins/origins-from-database.js"
import {PlatformUserAuth} from "../policies/types/platform-user-auth.js"
import {throwProblems} from "../../../toolbox/topic-validation/throw-problems.js"

export const appTopic = ({
		rando,
		config,
	}: AuthApiOptions) => asTopic<PlatformUserAuth>()({

	async listApps({tables, statsHub}, {id_ownerUser}: {
			id_ownerUser: string
		}): Promise<AppDisplay[]> {
		const ownerships = await tables.app.appOwnership.read(find({id_user: id_ownerUser}))
		const appRows = ownerships.length
			? await tables.app.app.read({
				conditions: and(
					or(...ownerships.map(own => ({equal: {id_app: own.id_app}}))),
					{equal: {archived: false}},
				)
			})
			: []
		return Promise.all(appRows.map(async row => ({
			id_app: row.id_app,
			label: row.label,
			home: row.home,
			origins: originsFromDatabase(row.origins),
			platform: isPlatform(row.id_app, config),
			stats: await concurrent({
				users: statsHub.countUsers(row.id_app),
				usersActiveDaily: statsHub.countUsersActiveDaily(row.id_app),
				usersActiveMonthly: statsHub.countUsersActiveMonthly(row.id_app),
			}),
		})))
	},

	async registerApp({tables}, {appDraft, id_ownerUser}: {
			appDraft: AppDraft
			id_ownerUser: string
		}): Promise<AppDisplay> {
		throwProblems(validateAppDraft(appDraft))
		const id_app = rando.randomId()
		await Promise.all([
			tables.app.app.create({
				id_app,
				label: appDraft.label,
				home: appDraft.home,
				origins: originsToDatabase(appDraft.origins),
				archived: false,
			}),
			tables.app.appOwnership.create({
				id_app,
				id_user: id_ownerUser,
			}),
		])
		return {
			...appDraft,
			id_app,
			stats: {
				users: 1,
				usersActiveDaily: 0,
				usersActiveMonthly: 0,
			},
		}
	},
})
