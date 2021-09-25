
import {Op, ops} from "../../../../framework/ops.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {madstate} from "../../../../toolbox/madstate/madstate.js"
import {VideoModelsOptions} from "../types/video-models-options.js"
import {VideoCatalogItem, VideoView} from "../../types/video-concepts.js"

export function makeContentModel({contentService}: VideoModelsOptions) {

	const state = madstate({
		accessOp: ops.none() as Op<AccessPayload>,
		catalog: ops.none() as Op<VideoCatalogItem.Any[]>
		views: ops.none() as Op<VideoView[]>,
	})

	return {
		state: state.readable,
		subscribe: state.subscribe,
		updateAccessOp(op: Op<AccessPayload>) {
			state.writable.accessOp = op
		},

		async load() {

		},

		get views() {
			return ops.value(state.readable.views)
		},

		getView(label: string) {
			const views = ops.value(state.readable.views)
			return views
				? views.find(view => view.label === label)
				: undefined
		},
	}
}
