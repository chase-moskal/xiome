
import * as renraku from "renraku"
import {mockVerifyToken} from "redcrypto/x/curries/mock-verify-token.js"

import {ops} from "../../../framework/ops.js"
import {mockVideoMeta} from "./meta/mock-meta.js"
import {VideoTables} from "../types/video-tables.js"
import {getRando} from "../../../toolbox/get-rando.js"
import {makeVideoModels} from "../models/video-models.js"
import {videoPrivileges} from "../api/video-privileges.js"
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {mockDacastSdk} from "../dacast/mocks/mock-dacast-sdk.js"
import {makeDacastService} from "../api/services/dacast-service.js"
import {mockAuthTables} from "../../auth/tables/mock-auth-tables.js"
import {makeContentService} from "../api/services/content-service.js"
import {goodApiKey} from "../dacast/mocks/parts/mock-dacast-constants.js"
import {mockConfig} from "../../../assembly/backend/config/mock-config.js"
import {mockAppTables} from "../../auth/aspects/apps/tables/mock-app-tables.js"
import {prepareAuthPolicies} from "../../auth/policies/prepare-auth-policies.js"
import {memoryFlexStorage} from "../../../toolbox/flex-storage/memory-flex-storage.js"
import {mockStorageTables} from "../../../assembly/backend/tools/mock-storage-tables.js"
import {UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"

export const viewPrivilege = "9244947a5736b1e0343340e8911e1e39bce60241f96dc4e39fbec372eb716bb2"

export const roles = {
	unworthy: [],
	viewer: [viewPrivilege],
	moderator: [
		videoPrivileges["view all videos"],
		videoPrivileges["moderate videos"],
	],
}

const dacastSdk = mockDacastSdk({goodApiKey})

export async function videoSetup() {
	const rando = await getRando()
	const appId = rando.randomId()
	const appOrigin = "chasemoskal.com"
	const config = mockConfig({
		platformHome: `https://xiome.io/`,
		platformOrigins: ["xiome.io"],
	})
	const storage = memoryFlexStorage()
	const unconstrainedAuthTables = new UnconstrainedTables(
		await mockAuthTables(storage)
	)
	await unconstrainedAuthTables.namespaceForApp(appId).permissions.privilege.create({
		hard: false,
		label: "view videos",
		privilegeId: DamnId.fromString(viewPrivilege),
		time: Date.now(),
	})
	const authPolicies = prepareAuthPolicies({
		config,
		appTables: await mockAppTables(storage),
		authTables: unconstrainedAuthTables,
		verifyToken: mockVerifyToken()
	})
	const basePolicy = authPolicies.anonPolicy
	const videoTables = new UnconstrainedTables(
		await mockStorageTables<VideoTables>(storage, {
			dacastAccountLinks: true,
			viewDacast: true,
			viewPrivileges: true,
		})
	)
	const rawDacastService = makeDacastService({
		config,
		dacastSdk,
		videoTables,
		basePolicy,
	})
	const rawContentService = makeContentService({
		config,
		dacastSdk,
		videoTables,
		basePolicy,
	})

	return {

		async for(privileges: string[]) {
			const meta = await mockVideoMeta({
				privileges,
				origins: [appOrigin],
				appId: appId.toString(),
				userId: rando.randomId().toString(),
			})
			const headers = {origin: appOrigin}

			const dacastService = renraku.mock()
				.forService(rawDacastService)
				.withMeta(async() => meta, async() => headers)

			const contentService = renraku.mock()
				.forService(rawContentService)
				.withMeta(async() => meta, async() => headers)

			const models = makeVideoModels({
				dacastService,
				contentService,
			})

			const {access} = await basePolicy(meta, headers)

			await Promise.all([
				models.dacastModel.updateAccessOp(ops.ready(access)),
				models.contentModel.updateAccessOp(ops.ready(access)),
			])

			return {
				models,
				async link() {
					await models.dacastModel.linkAccount({apiKey: goodApiKey})
					return models
				},
			}
		}
	}
}
