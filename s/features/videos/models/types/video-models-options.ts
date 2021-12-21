
import * as renraku from "renraku"

import {makeDacastService} from "../../api/services/dacast-service.js"
import {makeContentService} from "../../api/services/content-service.js"

export interface VideoModelsOptions {
	dacastService: renraku.Remote<ReturnType<typeof makeDacastService>>
	contentService: renraku.Remote<ReturnType<typeof makeContentService>>
}
