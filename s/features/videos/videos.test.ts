
import {Suite, expect, assert} from "cynic"
import {_context} from "renraku/x/types/symbols/context-symbol.js"
import {_descriptor} from "renraku/x/types/symbols/descriptor-symbol.js"

import {ops} from "../../framework/ops.js"
import {badApiKey, goodApiKey, roles, videoTestingSetup} from "./testing/video-testing-setup.js"

export default <Suite>{
	"dacast integration": {

		async "dacast accounts can be linked, and unlinked"() {
			const {dacastModel} = await videoTestingSetup({
				privileges: roles.moderator,
			})
			expect(await dacastModel.loadLinkedAccount()).not.ok()
			await dacastModel.linkAccount({apiKey: goodApiKey})
			const {linkedAccount} = dacastModel
			expect(linkedAccount).ok()
			assert(
				typeof linkedAccount.time === "number",
				"dacast account link has timestamp"
			)
			await dacastModel.unlinkAccount()
			expect(dacastModel.linkedAccount).not.ok()
		},

		async "invalid api keys are rejected"() {
			const {dacastModel} = await videoTestingSetup({
				privileges: roles.moderator,
			})
			const link = await dacastModel.linkAccount({apiKey: badApiKey})
			expect(link).not.ok()
		},

		async "viewers cannot link dacast account"() {
			const {dacastModel} = await videoTestingSetup({
				privileges: roles.viewer,
			})
			await expect(async() => {
				await dacastModel.linkAccount({apiKey: goodApiKey})
			}).throws()
			assert(
				ops.isError(dacastModel.state.linkedAccountOp),
				"client-facing error should appear"
			)
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
