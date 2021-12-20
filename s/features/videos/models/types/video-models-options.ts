
import {RenrakuRemote} from "renraku"

import {makeDacastService} from "../../api/services/dacast-service.js"
import {makeContentService} from "../../api/services/content-service.js"

export interface VideoModelsOptions {
	dacastService: RenrakuRemote<ReturnType<typeof makeDacastService>>
	contentService: RenrakuRemote<ReturnType<typeof makeContentService>>
}
