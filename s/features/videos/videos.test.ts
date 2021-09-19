
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

interface SetupOptions {
	privileges: string[]
}

const badApiKey = "nnn"
const goodApiKey = "yyy"

const viewer = []
const moderator = []
const unworthy = []

export type MockApiContext<xApiContext extends ApiContext<any, any, any, any>> = {
	[P in keyof xApiContext]: xApiContext[P] extends ProcedureDescriptor<any, any, any, any, any>
		? (...args: DropFirst<Parameters<xApiContext[P]["func"]>>) => ReturnType<xApiContext[P]["func"]>
		: xApiContext[P] extends ApiContext<any, any , any, any>
			? MockApiContext<xApiContext[P]>
			: never
}

export function mockApiContext<xApiContext extends ApiContext<any, any, any, any>>(apiContext: xApiContext) {
	return function(auth: xApiContext extends ApiContext<any, infer xAuth, any, any> ? xAuth : never): MockApiContext<xApiContext> {
		function recurse(context: ApiContext<any, any, any, any>) {
			return objectMap(context, value => {
				if (value[_descriptor])
					return (...args: any[]) => (<ProcedureDescriptor<any, any, any, any, any>>value).func(auth, ...args)
				else if (value[_context])
					return recurse(value)
				else
					throw new Error("error mocking api context")
			})
		}
		return recurse(apiContext)
	}
}

async function testingSetup({privileges}: SetupOptions) {
	const dacastSdk = mockDacastSdk({goodApiKey})
	const rando = await getRando()
	const storage = memoryFlexStorage()
	const videoTables = await mockStorageTables<VideoTables>(storage, {
		dacastAccountLinks: true,
	})
	const authTables = await mockAuthTables(storage)
	const videoAuth: VideoAuth = (() => {
		const permit = {privileges}
		return {
			access: {
				appId: "",
				origins: [],
				permit,
				scope: {core: true},
				user: {
					profile: {
						avatar: undefined,
						nickname: "Steven Seagal",
						tagline: "totally ripped and sweet",
					},
					roles: [],
					stats: {
						joined: Date.now(),
					},
					userId: rando.randomId().toString(),
				},
			},
			authTables,
			checker: makePrivilegeChecker(permit, appPermissions.privileges),
			videoTables,
		}
	})()
	const numptyService = makeDacastService({
		dacastSdk,
		videoTables: new UnconstrainedTables(videoTables),
		async basePolicy(meta, request) {return undefined},
	})
	const dacastService = mockApiContext(numptyService)(videoAuth)
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
			await dacastModel.linkAccount({apiKey: goodApiKey})
			assert(ops.isError(dacastModel.state.linkedAccountOp), "should be rejected")
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
