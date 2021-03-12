
import {asTopic} from "renraku/x/identities/as-topic.js"

import {isPlatform} from "../tools/is-platform.js"
import {AppDraft} from "../types/apps/app-draft.js"
import {throwProblems} from "./apps/throw-problems.js"
import {AppDisplay} from "../types/apps/app-display.js"
import {concurrent} from "../../../toolbox/concurrent.js"
import {AuthApiOptions} from "../types/auth-api-options.js"
import {validateAppDraft} from "./apps/validate-app-draft.js"
import {and, find, or} from "../../../toolbox/dbby/dbby-mongo.js"
import {originsToDatabase} from "./origins/origins-to-database.js"
import {originsFromDatabase} from "./origins/origins-from-database.js"
import {PlatformUserAuth} from "../policies/types/platform-user-auth.js"
import {requireUserIsAllowedToEditApp} from "./apps/require-user-is-allowed-to-edit-app.js"

export const appTopic = ({
		rando,
		config,
	}: AuthApiOptions) => asTopic<PlatformUserAuth>()({

	async listApps({tables, statsHub}, {ownerUserId}: {
			ownerUserId: string
		}): Promise<AppDisplay[]> {
		const ownerships = await tables.app.appOwnership.read(find({userId: ownerUserId}))
		const appRows = await tables.app.app.read({
			conditions: and(
				{equal: {archived: false}},
				or(...ownerships.map(own => ({equal: {appId: own.appId}})))
			)
		})
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
		}) {
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
		return {appId}
	},

	async updateApp({tables, access}, {appId, appDraft}: {
			appId: string
			appDraft: AppDraft
		}) {
		await requireUserIsAllowedToEditApp({tables, access, appId})
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
		await requireUserIsAllowedToEditApp({tables, access, appId})
		await tables.app.app.update({
			...find({appId}),
			write: {archived: true},
		})
	},
})
