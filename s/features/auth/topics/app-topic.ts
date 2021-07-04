
import {asTopic} from "renraku/x/identities/as-topic.js"

import {isPlatform} from "../tools/is-platform.js"
import {AppDraft} from "../types/apps/app-draft.js"
import {AppDisplay} from "../types/apps/app-display.js"
import {concurrent} from "../../../toolbox/concurrent.js"
import {AuthApiOptions} from "../types/auth-api-options.js"
import {validateAppDraft} from "./apps/validate-app-draft.js"
import {and, find, or} from "../../../toolbox/dbby/dbby-mongo.js"
import {originsToDatabase} from "./origins/origins-to-database.js"
import {originsFromDatabase} from "./origins/origins-from-database.js"
import {PlatformUserAuth} from "../policies/types/platform-user-auth.js"
import {throwProblems} from "../../../toolbox/topic-validation/throw-problems.js"

export const appTopic = ({
		rando,
		config,
	}: AuthApiOptions) => asTopic<PlatformUserAuth>()({

	async listApps({tables, statsHub}, {ownerUserId}: {
			ownerUserId: string
		}): Promise<AppDisplay[]> {
		const ownerships = await tables.app.appOwnership.read(find({userId: ownerUserId}))
		const appRows = ownerships.length
			? await tables.app.app.read({
				conditions: and(
					or(...ownerships.map(own => ({equal: {appId: own.appId}}))),
					{equal: {archived: false}},
				)
			})
			: []
		return Promise.all(appRows.map(async row => ({
			appId: row.appId,
			label: row.label,
			home: row.home,
			origins: originsFromDatabase(row.origins),
			platform: isPlatform(row.appId, config),
			stats: await concurrent({
				users: statsHub.countUsers(row.appId),
				usersActiveDaily: statsHub.countUsersActiveDaily(row.appId),
				usersActiveMonthly: statsHub.countUsersActiveMonthly(row.appId),
			}),
		})))
	},

	async registerApp({tables}, {appDraft, ownerUserId}: {
			appDraft: AppDraft
			ownerUserId: string
		}): Promise<AppDisplay> {
		throwProblems(validateAppDraft(appDraft))
		const appId = rando.randomId()
		await Promise.all([
			tables.app.app.create({
				appId,
				label: appDraft.label,
				home: appDraft.home,
				origins: originsToDatabase(appDraft.origins),
				archived: false,
			}),
			tables.app.appOwnership.create({
				appId,
				userId: ownerUserId,
			}),
		])
		return {
			...appDraft,
			appId,
			stats: {
				users: 1,
				usersActiveDaily: 0,
				usersActiveMonthly: 0,
			},
		}
	},
})
