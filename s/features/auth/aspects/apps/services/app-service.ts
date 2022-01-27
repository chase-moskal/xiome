
import * as renraku from "renraku"
import {Id, find, and, or} from "dbmage"

import {AppDraft} from "../types/app-draft.js"
import {AppDisplay} from "../types/app-display.js"
import {isPlatform} from "../../../utils/is-platform.js"
import {AuthOptions} from "../../../types/auth-options.js"
import {concurrent} from "../../../../../toolbox/concurrent.js"
import {validateAppDraft} from "../utils/validate-app-draft.js"
import {originsToDatabase} from "../../../utils/origins-to-database.js"
import {originsFromDatabase} from "../../../utils/origins-from-database.js"
import {throwProblems} from "../../../../../toolbox/topic-validation/throw-problems.js"

export const makeAppService = ({
	rando, config, authPolicies,
}: AuthOptions) => renraku.service()

.policy(authPolicies.platformUserPolicy)

.expose(({database, statsHub}) => ({

	async listApps({ownerUserId: ownerUserIdString}: {
			ownerUserId: string
		}): Promise<AppDisplay[]> {

		const ownerUserId = Id.fromString(ownerUserIdString)

		const ownerships = await database.tables.apps.owners.read(find({userId: ownerUserId}))
		const appRows = ownerships.length
			? await database.tables.apps.registrations.read({
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

		const ownerUserId = Id.fromString(ownerUserIdString)
		const appId = rando.randomId()

		await Promise.all([
			database.tables.apps.registrations.create({
				appId,
				label: appDraft.label,
				home: appDraft.home,
				origins: originsToDatabase(appDraft.origins),
				archived: false,
			}),
			database.tables.apps.owners.create({
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
