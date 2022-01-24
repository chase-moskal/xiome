
import {Suite, expect, assert} from "cynic"

import {ops} from "../../framework/ops.js"
import {roles, videoSetup, viewPrivilege} from "./testing/video-setup.js"
import {badApiKey, goodApiKey} from "./dacast/mocks/parts/mock-dacast-constants.js"

export default <Suite>{

	"integrations": {

		async "content returns no-show when dacast account unlinked"() {
			const label = "default"
			const setup = await videoSetup()
			const perspectives = {
				moderator: await setup.for(roles.moderator).then(s => s.models),
				viewer: await setup.for(roles.viewer).then(s => s.models),
			}
			{
				await perspectives.moderator.dacastModel.initialize()
				await perspectives.moderator.dacastModel.linkAccount({apiKey: goodApiKey})
				expect(perspectives.moderator.dacastModel.linkedAccount).ok()

				const {contentModel} = perspectives.moderator
				await contentModel.initializeForVideo(label)
				expect(contentModel.catalog.length).ok()
				expect(contentModel.privileges.length).ok()
				const [item] = contentModel.catalog
				await contentModel.setView({
					label,
					reference: {
						id: item.id,
						type: item.type,
						provider: item.provider,
					},
					privileges: [viewPrivilege],
				})
				expect(contentModel.getShow(label).details).ok()
			}
			{
				const {contentModel} = perspectives.viewer
				await contentModel.initializeForVideo(label)
				const show = contentModel.getShow(label)
				expect(show).ok()
				expect(show.label).equals(label)
				expect(show.details).ok()
				expect(show.details.embed).ok()
			}
		},
	},

	"dacast model": {

		async "dacast accounts can be linked, and unlinked"() {
			const {dacastModel} = await videoSetup()
				.then(s => s.for(roles.moderator))
				.then(s => s.models)
			expect(await dacastModel.initialize()).not.ok()
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
			await dacastModel.initialize()
			const link = await dacastModel.linkAccount({apiKey: badApiKey})
			expect(link).not.ok()
		},

		async "viewers cannot link dacast account"() {
			const {dacastModel} = await videoSetup()
				.then(s => s.for(roles.viewer))
				.then(s => s.models)
			await dacastModel.initialize()
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

		async "moderator can see catalog"() {
			const setup = await videoSetup()
			const label = "default"
			{
				const {contentModel} = await setup.for(roles.moderator)
					.then(s => s.link())
				assert(contentModel.catalog.length === 0, "catalog should start empty")
				await contentModel.initializeForVideo(label)
				assert(contentModel.catalog.length, "catalog should not be empty")
			}
			return {
				async "viewers can't see the catalog"() {
					const {contentModel} = await setup.for(roles.viewer)
						.then(s => s.models)
					assert(contentModel.catalog.length === 0, "catalog should start empty")
					await contentModel.initializeForVideo(label)
					expect(contentModel.views.length).equals(0)
				},
			}
		},

		async "moderator can manage views"() {
			const setup = await videoSetup()
			const label = "view"
			const label2 = "view2"
			{
				const {contentModel} = await setup.for(roles.moderator)
					.then(s => s.link())
				await contentModel.initializeForVideo(label)
				assert(contentModel.views.length === 0, "content views array should start empty")
				assert(!contentModel.getView(label), "specific content view should start undefined")
				await contentModel.setView({
					label,
					privileges: [viewPrivilege],
					reference: contentModel.catalog[0],
				})
				assert(contentModel.views.length === 1, "content view should be listed")
				await contentModel.setView({
					label: label2,
					privileges: [viewPrivilege],
					reference: contentModel.catalog[1],
				})
				assert(contentModel.views.length === 2, "content view should be listed")
				await contentModel.deleteView(label)
				assert(contentModel.views.length === 1, "content view should be deleted")
			}
			{
				const {contentModel} = await setup.for(roles.moderator)
					.then(s => s.models)
				await contentModel.initializeForVideo(label)
				assert(contentModel.views.length === 1, "other moderator should be able to see previous set views")
			}
		},

		async "users can access shows"() {
			const setup = await videoSetup()
			const label = "view"
			{
				const {contentModel} = await setup.for(roles.moderator)
					.then(s => s.link())
				await contentModel.initializeForVideo(label)
				await contentModel.setView({
					label,
					privileges: [viewPrivilege],
					reference: contentModel.catalog[0],
				})
				const view = contentModel.getView(label)
				const show = contentModel.getShow(label)
				expect(view).ok()
				expect(show).ok()
				expect(show.details).ok()
				expect(show.details.embed).ok()
			}
			return {
				async "viewer can access show"() {
					const {contentModel} = await setup.for(roles.viewer)
						.then(s => s.models)
					await contentModel.initializeForVideo(label)
					const show = contentModel.getShow(label)
					expect(show).ok()
					expect(show.details).ok()
					expect(show.details.embed).ok()
				},
				async "unworthy cannot access show"() {
					const {contentModel} = await setup.for(roles.unworthy)
						.then(s => s.models)
					await contentModel.initializeForVideo(label)
					const show = contentModel.getShow(label)
					expect(show).ok()
					expect(show.details).not.ok()
				},
			}
		},

		async "shows are updated when view is updated"() {
			const setup = await videoSetup()
			const label = "view"
			const label2 = "view2"
			{
				const {contentModel} = await setup.for(roles.moderator)
					.then(s => s.link())
				await contentModel.initializeForVideo(label)
				expect(contentModel.getShow(label)?.details).not.ok()
				await contentModel.setView({
					label,
					privileges: [viewPrivilege],
					reference: contentModel.catalog[0],
				})
				expect(contentModel.getShow(label)?.details).ok()
				await contentModel.setView({
					label: label2,
					privileges: [viewPrivilege],
					reference: contentModel.catalog[1],
				})
				expect(contentModel.getShow(label2)?.details).ok()
				await contentModel.deleteView(label)
				expect(contentModel.getShow(label)?.details).not.ok()
				await contentModel.setView({
					label: label2,
					privileges: [viewPrivilege],
					reference: contentModel.catalog[2],
				})
				expect(contentModel.getShow(label2).details.id)
					.equals(contentModel.catalog[2].id)
			}
		},
	},
}
