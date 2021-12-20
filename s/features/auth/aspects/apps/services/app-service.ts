
import {renrakuService} from "renraku"

import {AppDraft} from "../types/app-draft.js"
import {AppDisplay} from "../types/app-display.js"
import {isPlatform} from "../../../utils/is-platform.js"
import {AuthOptions} from "../../../types/auth-options.js"
import {concurrent} from "../../../../../toolbox/concurrent.js"
import {validateAppDraft} from "../utils/validate-app-draft.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {originsToDatabase} from "../../../utils/origins-to-database.js"
import {and, find, or} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {originsFromDatabase} from "../../../utils/origins-from-database.js"
import {throwProblems} from "../../../../../toolbox/topic-validation/throw-problems.js"

export const makeAppService = ({
	rando, config, authPolicies,
}: AuthOptions) => renrakuService()

.policy(authPolicies.platformUserPolicy)

.expose(({appTables, statsHub}) => ({

	async listApps({ownerUserId: ownerUserIdString}: {
			ownerUserId: string
		}): Promise<AppDisplay[]> {

		const ownerUserId = DamnId.fromString(ownerUserIdString)

		const ownerships = await appTables.owners.read(find({userId: ownerUserId}))
		const appRows = ownerships.length
			? await appTables.registrations.read({
				conditions: and(
					or(...ownerships.map(own => ({equal: {appId: own.appId}}))),
					{equal: {archived: false}},
				)
			})
			: []
		return Promise.all(appRows.map(async row => ({
			appId: row.appId.toString(),
			label: row.label,
			home: row.home,
			origins: originsFromDatabase(row.origins),
			platform: isPlatform(row.appId.toString(), config),
			stats: await concurrent({
				users: statsHub.countUsers(row.appId),
				usersActiveDaily: statsHub.countUsersActiveDaily(row.appId),
				usersActiveMonthly: statsHub.countUsersActiveMonthly(row.appId),
			}),
		})))
	},

	async registerApp({appDraft, ownerUserId: ownerUserIdString}: {
			appDraft: AppDraft
			ownerUserId: string
		}): Promise<AppDisplay> {

		throwProblems(validateAppDraft(appDraft))

		const ownerUserId = DamnId.fromString(ownerUserIdString)

		const appId = rando.randomId()
		await Promise.all([
			appTables.registrations.create({
				appId,
				label: appDraft.label,
				home: appDraft.home,
				origins: originsToDatabase(appDraft.origins),
				archived: false,
			}),
			appTables.owners.create({
				appId,
				userId: ownerUserId,
			}),
		])
		return {
			...appDraft,
			appId: appId.toString(),
			stats: {
				users: 1,
				usersActiveDaily: 0,
				usersActiveMonthly: 0,
			},
		}
	},
}))
