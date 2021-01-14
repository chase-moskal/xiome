
import {asTopic} from "renraku/x/identities/as-topic.js"

import {find, or} from "../../../toolbox/dbby/dbby-mongo.js"
import {PlatformUserAuth, AuthOptions, AppPayload, AppDraft, AppTokenDraft} from "../auth-types.js"

export const appTopic = ({rando}: AuthOptions) => asTopic<PlatformUserAuth>()({

	async listApps({tables}, {ownerUserId}: {
			ownerUserId: string
		}) {
		const ownerships = await tables.appOwnership.read(find({userId: ownerUserId}))
		const appRows = await tables.app.read({
			conditions: or(...ownerships.map(own => ({equal: {appId: own.appId}})))
		})
		const payloads = Promise.all(appRows.map(async row => {
			const appTokenRows = await tables.appToken.one(find({appId: row.appId}))
			return <AppPayload>{
				appId: row.appId,
				home: row.home,
				platform: false,
				label: row.label,
				origins: appTokenRows
					? appTokenRows.origins.split(";")
					: [],
			}
		}))
		return payloads
	},

	async registerApp({tables}, {appDraft, ownerUserId}: {
			appDraft: AppDraft
			ownerUserId: string
		}) {
		const appId = rando.randomId()
		await Promise.all([
			tables.app.create({
				appId,
				label: appDraft.label,
				home: appDraft.home,
			}),
			tables.appOwnership.create({
				appId,
				userId: ownerUserId,
			})
		])
		return {appId}
	},

	async updateApp({tables}, {appId, draft}: {
			appId: string
			draft: AppDraft
		}) {
		await tables.app.update({
			...find({appId}),
			whole: {
				appId,
				home: draft.home,
				label: draft.label,
			},
		})
	},

	async registerAppToken({tables}, draft: AppTokenDraft) {
		const appTokenId = rando.randomId()
		await tables.appToken.create({
			appTokenId,
			appId: draft.appId,
			label: draft.label,
			origins: draft.origins.join(";"),
		})
	},

	async updateAppToken({tables}, {appTokenId, draft}: {
			appTokenId: string
			draft: AppTokenDraft
		}) {
		await tables.appToken.update({
			...find({appTokenId}),
			whole: {
				appTokenId,
				appId: draft.appId,
				label: draft.label,
				origins: draft.origins.join(";"),
			},
		})
	},

	async deleteAppToken({tables}, {appTokenId}: {appTokenId: string}) {
		await tables.appToken.delete(find({appTokenId}))
	},
})
