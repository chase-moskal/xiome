
import {ApiError} from "renraku/x/api/api-error"
import {asTopic} from "renraku/x/identities/as-topic.js"

import {day} from "../../../toolbox/timely.js"
import {find, or} from "../../../toolbox/dbby/dbby-mongo.js"
import {AccessPayload, AppRow, AppTokenRow, AuthTables} from "../../../types.js"
import {PlatformUserAuth, AuthOptions, AppPayload, AppDraft, AppTokenDraft} from "../auth-types.js"

export interface AppDisplay {
	appId: string
	label: string
	home: string
	tokens: AppTokenDisplay[]
}

export interface AppTokenDisplay {
	appToken: string
	appTokenId: string
	label: string
	expiry: number
	origins: string[]
}

export const appTopic = ({rando, signToken}: AuthOptions) => {
	const appTokenLifespan = 30 * day

	async function requireUserIsAllowedToEditApp({access, appId, tables}: {
			access: AccessPayload
			appId: string
			tables: AuthTables
		}) {
		const {userId} = access.user
		const ownershipRow = await tables.appOwnership.one(find({userId, appId}))
		if (!ownershipRow) throw new ApiError(403, "user is not allowed")
	}

	async function signAppToken(app: AppPayload) {
		return {
			expiry: Date.now() + appTokenLifespan,
			appToken: await signToken<AppPayload>({
				payload: app,
				lifespan: appTokenLifespan,
			})
		}
	}

	async function getApp(tables: AuthTables, appId: string): Promise<AppRow> {
		const appRow = await tables.app.one(find({appId}))
		if (!appRow) throw new ApiError(404, "appId not found")
		return appRow
	}

	async function makeAppTokenRow(appRow: AppRow, draft: AppTokenDraft) {
		const appTokenId = rando.randomId()
		const app: AppPayload = {
			appId: appRow.appId,
			home: appRow.home,
			label: appRow.label,
			origins: draft.origins,
		}
		const {appToken, expiry} = await signAppToken(app)
		return <AppTokenRow>{
			expiry,
			appToken,
			appTokenId,
			appId: draft.appId,
			label: draft.label,
			origins: draft.origins.join(";"),
		}
	}

	return asTopic<PlatformUserAuth>()({
		async listApps({tables}, {ownerUserId}: {
				ownerUserId: string
			}) {
			const ownerships = await tables.appOwnership.read(find({userId: ownerUserId}))
			const appRows = await tables.app.read({
				conditions: or(...ownerships.map(own => ({equal: {appId: own.appId}})))
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
					appId: appRow.appId,
					label: appRow.label,
					home: appRow.home,
				}
			}))
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
				},
			})
		},

		async registerAppToken({tables, access}, {draft}: {
				draft: AppTokenDraft
			}) {
			await requireUserIsAllowedToEditApp({tables, access, appId: draft.appId})
			const appRow = await getApp(tables, draft.appId)
			const appTokenRow = await makeAppTokenRow(appRow, draft)
			await tables.appToken.create(appTokenRow)
		},

		async updateAppToken({tables, access}, {appTokenId, draft}: {
				appTokenId: string
				draft: AppTokenDraft
			}) {
			await requireUserIsAllowedToEditApp({tables, access, appId: draft.appId})
			const appRow = await getApp(tables, draft.appId)
			const appTokenRow = await makeAppTokenRow(appRow, draft)
			await tables.appToken.update({
				...find({appTokenId}),
				whole: appTokenRow,
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
}
