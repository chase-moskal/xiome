
import {processPayloadTopic as processAuth} from "renraku/dist/curries.js"

import {Rando} from "../../../toolbox/get-rando.js"
import {find, or} from "../../../toolbox/dbby/dbby-helpers.js"
import {AuthTables, VerifyToken, PlatformConfig, GetTables, AppDraft, AppPayload, AppTokenDraft, AppTokenRow} from "../auth-types.js"

import {processRequestForPlatformUser} from "./auth-processors/process-request-for-platform-user.js"

export function makeAppTopic({
			rando,
			config,
			getTables,
			verifyToken,
		}: {
			rando: Rando
			config: PlatformConfig
			verifyToken: VerifyToken
			getTables: GetTables<AuthTables>
		}) {
	return processAuth(processRequestForPlatformUser({verifyToken, getTables}), {

		async listApps({access, app, tables}, {ownerUserId}: {
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

		async registerApp({access, app, tables}, {appDraft, ownerUserId}: {
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

		async updateApp({access, app, tables}, {appId, draft}: {
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

		async registerAppToken({access, app, tables}, draft: AppTokenDraft) {
			const appTokenId = rando.randomId()
			await tables.appToken.create({
				appTokenId,
				appId: draft.appId,
				label: draft.label,
				origins: draft.origins.join(";"),
			})
		},

		async updateAppToken({access, app, tables}, {appTokenId, draft}: {
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

		async deleteAppToken({access, app, tables}, {appTokenId}: {appTokenId: string}) {
			await tables.appToken.delete(find({appTokenId}))
		},
	})
}
