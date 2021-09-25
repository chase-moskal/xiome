
import {Op, ops} from "../../../../framework/ops.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {madstate} from "../../../../toolbox/madstate/madstate.js"
import {VideoModelsOptions} from "../types/video-models-options.js"
import {VideoHosting, VideoShow, VideoView} from "../../types/video-concepts.js"

export function makeContentModel({contentService}: VideoModelsOptions) {

	const state = madstate({
		accessOp: ops.none() as Op<AccessPayload>,
		catalog: ops.none() as Op<VideoHosting.AnyContent[]>,
		views: ops.none() as Op<VideoView[]>,
		shows: ops.none() as Op<VideoShow[]>,
	})

	return {
		state: state.readable,
		subscribe: state.subscribe,
		updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
		},

		async loadModerationData() {
			// TODO implement lol
		},

		async loadShow(label: string) {
			// TODO implement lol
		},

		get catalog() {
			return ops.value(state.readable.catalog)
		},

		get views() {
			return ops.value(state.readable.views)
		},

		get shows() {
			return ops.value(state.readable.shows)
		},

		getView(label: string) {
			const views = ops.value(state.readable.views)
			return views
				? views.find(view => view.label === label)
				: undefined
		},

		getShow(label: string) {
			const shows = ops.value(state.readable.shows)
			return shows
				? shows.find(show => show.label === label)
				: undefined
		},

		async setView(options: {
				label: string
				privileges: string[]
				content: VideoHosting.AnyReference
			}) {
			await contentService.writeView(options)
			// TODO update local state
		},

		async deleteView(label: string) {
			// await contentService.deleteView(label)
			// TODO update local state
		},
	}
}
