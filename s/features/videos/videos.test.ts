
import {Suite, expect, assert} from "cynic"
import {assembleTestableSystem} from "../../assembly/testing/assemble-testable-system.js"
import {ops} from "../../framework/ops.js"

// async function commonSetup() {
// 	const {windowForApp, login} = await assembleTestableSystem()
// 	await login({
// 		email: "creative@example.com",
// 		appWindow: windowForApp,
// 	})
// 	return windowForApp
// }

interface SetupOptions {
	privileges: string[]
}

const badApiKey = "nnn"
const goodApiKey = "yyy"

const moderator = []
const viewer = []
const unworthy = []

async function setupVideoModels({privileges}: SetupOptions) {
	return <any>undefined
}

async function setupLinked(options: SetupOptions) {
	const models = setupVideoModels(options)
	await models.dacastModel.linkAccount({apiKey: goodApiKey})
	return models
}

export default <Suite>{
	"dacast integration": {
		async "dacast accounts can be linked, and unlinked"() {
			const {dacastModel} = await setupVideoModels({privileges: moderator})
			expect(await dacastModel.getLinkedAccount()).not.ok()
			await dacastModel.linkAccount({apiKey: goodApiKey})
			const {linkedAccount} = dacastModel
			expect(linkedAccount).ok()
			assert(typeof linkedAccount.time === "number", "dacast account link has timestamp")
			await dacastModel.unlinkAccount()
			expect(await dacastModel.linkedAccount).not.ok()

		},
		async "invalid api keys are rejected"() {
			const {dacastModel} = await setupVideoModels({privileges: moderator})
			await dacastModel.linkAccount({apiKey: badApiKey})
			assert(ops.isError(dacastModel.state.linkedAccountOp), "should be rejected")
		},
		async "viewers cannot link dacast account"() {
			const {dacastModel} = await setupVideoModels({privileges: viewer})
			await dacastModel.linkAccount({apiKey: goodApiKey})
			assert(ops.isError(dacastModel.state.linkedAccountOp), "should be rejected")
		},
	},
	"videos model": {
		async "mods can see whole available catalog"() {
			const {videosModel} = await setupLinked({privileges: moderator})
			await videosModel.initialize()
			const {catalogOp} = videosModel.state
		},
		async "viewers cannot see catalog"() {
			const {videosModel} = await setupLinked({privileges: viewer})
			await videosModel.initialize()
			const {catalogOp} = videosModel.state
			assert(!ops.isReady(catalogOp), "catalog should not be available to unprivileged user")
		},
		async "mods can select a catalog item to display"() {
			const {videosModel} = await setupLinked({privileges: moderator})
			await videosModel.initialize()
			const {catalog} = videosModel
			await videosModel.setItem({item: catalog[0]})
		},
		async "unprivileged users are forbidden to view the playlist"() {return false},
	},
	// "xiome-vods": {
	// 	async "admin can select a dacast playlist and viewership privilege"() {return false},
	// 	async "privileged users can view the playlist"() {return false},
	// 	async "unprivileged users are forbidden to view the playlist"() {return false},
	// },
}
