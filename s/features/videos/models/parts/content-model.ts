
import {Op, ops} from "../../../../framework/ops.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {madstate} from "../../../../toolbox/madstate/madstate.js"
import {VideoModelsOptions} from "../types/video-models-options.js"
import {VideoHosting, VideoShow, VideoView} from "../../types/video-concepts.js"

export function makeContentModel({contentService}: VideoModelsOptions) {

	const state = madstate({
		accessOp: ops.none() as Op<AccessPayload>,
		catalogOp: ops.none() as Op<VideoHosting.AnyContent[]>,
		viewsOp: ops.none() as Op<VideoView[]>,
		showsOp: ops.none() as Op<VideoShow[]>,
	})

	return {
		state: state.readable,
		subscribe: state.subscribe,
		updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
		},

		async loadModerationData() {
			await ops.operation({
				promise: contentService.fetchCatalog(),
				setOp: op => state.writable.catalogOp = op,
			})
		},

		async loadShow(label: string) {
			const oldShows = ops.value(state.readable.showsOp) ?? []
			let updatedShow: VideoShow
			await ops.operation({
				setOp: op => state.writable.showsOp = op,
				promise: contentService.getShow({label})
					.then(show => updatedShow = show)
					.then(show => [
						...oldShows.filter(s => s.label !== label),
						show,
					]),
			})
			return updatedShow
		},

		get catalog() {
			return ops.value(state.readable.catalogOp)
		},

		get views() {
			return ops.value(state.readable.viewsOp)
		},

		get shows() {
			return ops.value(state.readable.showsOp)
		},

		getView(label: string) {
			const views = ops.value(state.readable.viewsOp)
			return views
				? views.find(view => view.label === label)
				: undefined
		},

		getShow(label: string) {
			const shows = ops.value(state.readable.showsOp)
			return shows
				? shows.find(show => show.label === label)
				: undefined
		},

		async setView(options: {
				label: string
				privileges: string[]
				content: VideoHosting.AnyReference
			}) {
			const oldViews = ops.value(state.readable.viewsOp) ?? []
			await ops.operation({
				setOp: op => state.writable.viewsOp = op,
				promise: contentService.writeView(options).then(() => [
					...oldViews.filter(v => v.label !== options.label),
				]),
			})
		},

		async deleteView(label: string) {
			const oldViews = ops.value(state.readable.viewsOp) ?? []
			await ops.operation({
				setOp: op => state.writable.viewsOp = op,
				promise: contentService.deleteView({label})
					.then(() => oldViews.filter(v => v.label !== label)),
			})
		},
	}
}
