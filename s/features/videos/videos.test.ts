
import {Suite, expect, assert} from "cynic"
import {_context} from "renraku/x/types/symbols/context-symbol.js"
import {_descriptor} from "renraku/x/types/symbols/descriptor-symbol.js"
import {appPermissions} from "../../assembly/backend/permissions/standard-permissions.js"

import {ops} from "../../framework/ops.js"
import {badApiKey, goodApiKey, roles, videoSetup, viewPrivilege} from "./testing/video-setup.js"

export default <Suite>{

	"dacast model": {

		async "dacast accounts can be linked, and unlinked"() {
			const {dacastModel} = await videoSetup()
				.then(s => s.for(roles.moderator))
				.then(s => s.models)
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
			const {dacastModel} = await videoSetup()
				.then(s => s.for(roles.moderator))
				.then(s => s.models)
			const link = await dacastModel.linkAccount({apiKey: badApiKey})
			expect(link).not.ok()
		},

		async "viewers cannot link dacast account"() {
			const {dacastModel} = await videoSetup()
				.then(s => s.for(roles.viewer))
				.then(s => s.models)
			await expect(async() => {
				await dacastModel.linkAccount({apiKey: goodApiKey})
			}).throws()
			assert(
				ops.isError(dacastModel.state.linkedAccountOp),
				"client-facing error should appear"
			)
		},
	},

	"content model": {

		async "mods can see catalog"() {
			const {contentModel} = await videoSetup()
				.then(s => s.for(roles.moderator))
				.then(s => s.link())
			assert(contentModel.catalog.length === 0, "catalog should start empty")
			await contentModel.loadCatalog()
			assert(contentModel.catalog.length, "catalog should not be empty")
		},

		async "mods can manage views, which associate content with privileges"() {
			const {contentModel} = await videoSetup()
				.then(s => s.for(roles.moderator))
				.then(s => s.link())
			const label = "view"
			await contentModel.loadCatalog()
			assert(contentModel.views.length, "content views array should start empty")
			assert(contentModel.getView(label), "specific content view should start undefined")
			await contentModel.setView({
				label,
				privileges: [viewPrivilege],
				dacastContent: contentModel.catalog[0],
			})
			assert(contentModel.views.length === 1, "content view should be listed")
			await contentModel.deleteView(label)
			assert(contentModel.views.length === 0, "content view should be deleted")
		},

		async "users can access view they have permission for"() {
			const setup = await videoSetup()
			const mod = await setup.for(roles.moderator)
				.then(s => s.link())
			const viewer = await setup.for(roles.viewer)
				.then(s => s.models)
			const unworthy = await setup.for(roles.unworthy)
				.then(s => s.models)
			const label = "view"
			{
				const {contentModel} = mod
				await contentModel.loadCatalog()
				await contentModel.setView({
					label,
					privileges: [viewPrivilege],
					dacastContent: contentModel.catalog[0],
				})
				expect(await contentModel.getView(label)).ok()
			}
			{
				const {contentModel} = viewer
				await contentModel.loadCatalog()
				expect(await contentModel.getView(label)).ok()
			}
			{
				const {contentModel} = unworthy
				await contentModel.loadCatalog()
				expect(await contentModel.getView(label)).not.ok()
			}
		},
	},

	// "xiome-vods": {
	// 	async "admin can select a dacast playlist and viewership privilege"() {return false},
	// 	async "privileged users can view the playlist"() {return false},
	// 	async "unprivileged users are forbidden to view the playlist"() {return false},
	// },
}
