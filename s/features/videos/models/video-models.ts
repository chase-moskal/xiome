
import {Op} from "../../../framework/ops.js"
import {makeDacastModel} from "./parts/dacast-model.js"
import {makeContentModel} from "./parts/content-model.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {VideoModelsOptions} from "./types/video-models-options.js"

export function makeVideoModels(options: VideoModelsOptions) {
	const dacastModel = makeDacastModel(options)
	const contentModel = makeContentModel(options)
	dacastModel.onLinkChange(contentModel.onVideoHostingUpdate)
	return {
		dacastModel,
		contentModel,
		updateAccessOp(accessOp: Op<AccessPayload>) {
			dacastModel.updateAccessOp(accessOp)
			contentModel.updateAccessOp(accessOp)
		},
	}
}
