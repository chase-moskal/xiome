
import {mockRemote} from "renraku/x/remote/mock-remote.js"
import {mockHttpRequest} from "renraku/x/remote/mock-http-request.js"

import {ops} from "../../framework/ops.js"
import {Suite, expect, assert} from "cynic"
import {makeVideoModels} from "./models/video-models.js"
import {makeDacastService} from "./api/services/dacast-service.js"
import {UnconstrainedTables} from "../../framework/api/types/table-namespacing-for-apps.js"
import {VideoTables} from "./types/video-tables.js"
import {mockStorageTables} from "../../assembly/backend/tools/mock-storage-tables.js"
import {memoryFlexStorage} from "../../toolbox/flex-storage/memory-flex-storage.js"
import {getRando} from "../../toolbox/get-rando.js"
import {mockAuthTables} from "../auth/tables/mock-auth-tables.js"
import {makePrivilegeChecker} from "../auth/aspects/permissions/tools/make-privilege-checker.js"
import {appPermissions} from "../../assembly/backend/permissions/standard-permissions.js"

import {ApiContext} from "renraku/x/types/api/api-context.js"
import {ProcedureDescriptor} from "renraku/x/types/api/procedure-descriptor.js"
import {objectMap} from "../../toolbox/object-map.js"
import {_descriptor} from "renraku/x/types/symbols/descriptor-symbol.js"
import {_context} from "renraku/x/types/symbols/context-symbol.js"
import {DropFirst} from "renraku/x/types/tools/drop-first.js"
import {VideoAuth} from "./types/video-auth.js"
import {mockDacastSdk} from "./dacast/dacast-sdk.js"
import {Policy} from "renraku/x/types/primitives/policy.js"
import {Remote} from "renraku/x/types/remote/remote.js"
import {Api} from "renraku/x/types/api/api.js"
import {DamnId} from "../../toolbox/damnedb/damn-id.js"
import {videoPrivileges} from "./api/video-privileges.js"
import {prepareAuthPolicies} from "../auth/policies/prepare-auth-policies.js"
import {mockAppTables} from "../auth/aspects/apps/tables/mock-app-tables.js"
import {mockConfig} from "../../assembly/backend/config/mock-config.js"
import {mockVerifyToken} from "redcrypto/x/curries/mock-verify-token.js"
import {mockVideoMeta} from "./testing/mock-meta.js"

interface SetupOptions {
	privileges: string[]
}

const badApiKey = "nnn"
const goodApiKey = "yyy"

const viewPrivilege = "9244947a5736b1e0343340e8911e1e39bce60241f96dc4e39fbec372eb716bb2"

const viewer = [viewPrivilege]
const moderator = [
	videoPrivileges["view all videos"],
	videoPrivileges["moderate videos"],
]
const unworthy = []

async function testingSetup({privileges}: SetupOptions) {
	const dacastSdk = mockDacastSdk({goodApiKey})
	const rando = await getRando()
	const origin = "example.com"
	const storage = memoryFlexStorage()
	const videoTables = await mockStorageTables<VideoTables>(storage, {
		dacastAccountLinks: true,
	})
	const authTables = await mockAuthTables(storage)
	// const auth = mockVideo({
	// 	authTables,
	// 	privileges,
	// 	videoTables,
	// 	userId: rando.randomId().toString(),
	// })
	const authPolicies = prepareAuthPolicies({
		appTables: await mockAppTables(storage),
		authTables: new UnconstrainedTables(authTables),
		config: mockConfig({
			platformHome: "",
			platformOrigins: [],
		}),
		verifyToken: mockVerifyToken()
	})
	const numptyService = makeDacastService({
		dacastSdk,
		videoTables: new UnconstrainedTables(videoTables),
		basePolicy: authPolicies.anonPolicy,
	})
	const dacastService = mockRemote(numptyService).withMeta({
		meta: await mockVideoMeta({
			privileges,
			origins: [origin],
			userId: rando.randomId().toString(),
		}),
		request: mockHttpRequest({origin}),
	})
	return makeVideoModels({dacastService})
}

async function setupLinked(options: SetupOptions) {
	const models = await testingSetup(options)
	await models.dacastModel.linkAccount({apiKey: goodApiKey})
	return models
}

export default <Suite>{
	"dacast integration": {
		async "dacast accounts can be linked, and unlinked"() {
			const {dacastModel} = await testingSetup({privileges: moderator})
			expect(await dacastModel.getLinkedAccount()).not.ok()
			await dacastModel.linkAccount({apiKey: goodApiKey})
			const {linkedAccount} = dacastModel
			expect(linkedAccount).ok()
			assert(typeof linkedAccount.time === "number", "dacast account link has timestamp")
			await dacastModel.unlinkAccount()
			expect(dacastModel.linkedAccount).not.ok()
		},
		async "invalid api keys are rejected"() {
			const {dacastModel} = await testingSetup({privileges: moderator})
			const link = await dacastModel.linkAccount({apiKey: badApiKey})
			expect(link).not.ok()
		},
		async "viewers cannot link dacast account"() {
			const {dacastModel} = await testingSetup({privileges: viewer})
			await expect(async() => {
				await dacastModel.linkAccount({apiKey: goodApiKey})
			}).throws()
			assert(ops.isError(dacastModel.state.linkedAccountOp), "client-facing error should appear")
		},
	},
	// "videos model": {
	// 	catalog: {
	// 		async "mods can see whole available catalog"() {
	// 			const {videosModel} = await setupLinked({privileges: moderator})
	// 			await videosModel.initialize()
	// 			const {catalogOp} = videosModel.state
	// 		},
	// 		async "viewers cannot see catalog"() {
	// 			const {videosModel} = await setupLinked({privileges: viewer})
	// 			await videosModel.initialize()
	// 			const {catalogOp} = videosModel.state
	// 			assert(!ops.isReady(catalogOp), "catalog should not be available to unprivileged user")
	// 		},
	// 	},
	// 	async "mods can select a catalog item to display"() {
	// 		const {videosModel} = await setupLinked({privileges: moderator})
	// 		await videosModel.initialize()
	// 		const {catalog} = videosModel
	// 		await videosModel.setItem({item: catalog[0]})
	// 	},
	// 	async "unprivileged users are forbidden to view the playlist"() {return false},
	// },
	// "xiome-vods": {
	// 	async "admin can select a dacast playlist and viewership privilege"() {return false},
	// 	async "privileged users can view the playlist"() {return false},
	// 	async "unprivileged users are forbidden to view the playlist"() {return false},
	// },
}
