
import {ApiError} from "renraku/x/api/api-error.js"
import {asTopic} from "renraku/x/identities/as-topic.js"

import {throwProblems} from "./apps/throw-problems.js"
import {AppDisplay} from "../types/apps/app-display.js"
import {validateAppDraft} from "./apps/validate-app-draft.js"
import {and, find, or} from "../../../toolbox/dbby/dbby-mongo.js"
import {originsToDatabase} from "./origins/origins-to-database.js"
import {originsFromDatabase} from "./origins/origins-from-database.js"
import {requireUserIsAllowedToEditApp} from "./apps/require-user-is-allowed-to-edit-app.js"
import {PlatformUserAuth, AuthOptions, AppDraft, AppToken, App} from "../auth-types.js"

export const appTopic = ({
		rando,
		config,
		signToken,
	}: AuthOptions) => asTopic<PlatformUserAuth>()({

	async authorizeApp({tables}, {appId}: {
			appId: string
		}): Promise<AppToken> {
		const appRow = await tables.app.one(find({appId}))
		if (appRow.archived) throw new ApiError(403, "app has been archived")
		return signToken<App>({
			lifespan: config.tokens.lifespans.app,
			payload: {
				appId,
				platform: false,
				permissions: undefined,
				origins: originsFromDatabase(appRow.origins),
			},
		})
	},

	async listApps({tables}, {ownerUserId}: {
			ownerUserId: string
		}): Promise<AppDisplay[]> {
		const ownerships = await tables.appOwnership.read(find({userId: ownerUserId}))
		const appRows = await tables.app.read({
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
		})))
	},

	async registerApp({tables}, {appDraft, ownerUserId}: {
			appDraft: AppDraft
			ownerUserId: string
		}) {
		throwProblems(validateAppDraft(appDraft))
		const appId = rando.randomId()
		await Promise.all([
			tables.app.create({
				appId,
				label: appDraft.label,
				home: appDraft.home,
				origins: originsToDatabase(appDraft.origins),
				archived: false,
			}),
			tables.appOwnership.create({
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
		await tables.app.update({
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
		await tables.app.update({
			...find({appId}),
			write: {archived: true},
		})
	},
})
