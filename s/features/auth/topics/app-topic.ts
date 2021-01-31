
import {ApiError} from "renraku/x/api/api-error.js"
import {asTopic} from "renraku/x/identities/as-topic.js"

import {getApp} from "./apps/get-app.js"
import {and, find, or} from "../../../toolbox/dbby/dbby-mongo.js"
import {makeAppTokenRow} from "./apps/make-app-token-row.js"
import {requireUserIsAllowedToEditApp} from "./apps/require-user-is-allowed-to-edit-app.js"

import {throwProblems} from "./apps/throw-problems.js"
import {AppDisplay} from "../types/apps/app-display.js"
import {validateAppDraft} from "./apps/validate-app-draft.js"
import {PlatformUserAuth, AuthOptions, AppDraft, AppTokenDraft} from "../auth-types.js"
import { regenerateAllTokensForApp } from "./apps/regenerate-all-tokens-for-app.js"

export const appTopic = ({
		rando,
		signToken,
	}: AuthOptions) => asTopic<PlatformUserAuth>()({

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

		return Promise.all(appRows.map(async appRow => {
			const appTokenRows = await tables.appToken.read(find({appId: appRow.appId}))
			const tokens = appTokenRows.map(tokenRow => ({
				label: tokenRow.label,
				expiry: tokenRow.expiry,
				appToken: tokenRow.appToken,
				appTokenId: tokenRow.appTokenId,
				origins: tokenRow.origins.split(";"),
			}))
			return {
				tokens,
				home: appRow.home,
				appId: appRow.appId,
				label: appRow.label,
			}
		}))
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
				archived: false,
			}),
			tables.appOwnership.create({
				appId,
				userId: ownerUserId,
			}),
		])
		return {appId}
	},

	async updateApp({tables, access}, {appId, draft}: {
			appId: string
			draft: AppDraft
		}) {
		await requireUserIsAllowedToEditApp({tables, access, appId})
		await tables.app.update({
			...find({appId}),
			whole: {
				appId,
				home: draft.home,
				label: draft.label,
				archived: false,
			},
		})
		await regenerateAllTokensForApp({appId, tables, rando, signToken})
	},

	async registerAppToken({tables, access}, {draft}: {
			draft: AppTokenDraft
		}) {
		await requireUserIsAllowedToEditApp({tables, access, appId: draft.appId})
		const appRow = await getApp(tables, draft.appId)
		const appTokenRow = await makeAppTokenRow({rando, signToken, appRow, draft})
		await tables.appToken.create(appTokenRow)
		return {appTokenId: appTokenRow.appTokenId}
	},

	async updateAppToken({tables, access}, {appTokenId, draft}: {
			appTokenId: string
			draft: AppTokenDraft
		}) {
		await requireUserIsAllowedToEditApp({tables, access, appId: draft.appId})
		const appRow = await getApp(tables, draft.appId)
		const appTokenRow = await makeAppTokenRow({rando, signToken, appRow, draft})
		await tables.appToken.update({
			...find({appTokenId}),
			whole: appTokenRow,
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

	async deleteAppToken({tables, access}, {appTokenId}: {
			appTokenId: string
		}) {
		const appTokenRow = await tables.appToken.one(find({appTokenId}))
		if (!appTokenRow) throw new ApiError(404, "appTokenId not found")
		await requireUserIsAllowedToEditApp({tables, access, appId: appTokenRow.appId})
		await tables.appToken.delete(find({appTokenId}))
	},
})
