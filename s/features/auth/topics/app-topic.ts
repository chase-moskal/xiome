
import {processPayloadTopic as processAuth} from "renraku/dist/curries.js"

import {Rando} from "../../../toolbox/get-rando.js"
import {find, or} from "../../../toolbox/dbby/dbby-helpers.js"
import {AuthTables, VerifyToken, PlatformConfig, GetTables, AppDraft, AppPayload} from "../auth-types.js"

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
			await tables.app.create({
				appId,
				label: appDraft.label,
				home: appDraft.home,
			})
			await tables.appOwnership.create({
				appId,
				userId: ownerUserId,
			})
			return {appId}
		},

		async updateApp({access, app, tables}, {appId}: {
				appId: string
				draft: AppDraft
			}) {
			throw new Error("TODO implement")
		},

		async registerAppToken({access, app, tables}, {appId}: {
				appId: string
			}) {
			throw new Error("TODO implement")
		},
	})
}
