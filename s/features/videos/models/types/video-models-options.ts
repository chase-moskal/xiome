
import {Service} from "../../../../types/service.js"
import {makeDacastService} from "../../api/services/dacast-service.js"
import {makeContentService} from "../../api/services/content-service.js"

export interface VideoModelsOptions {
	dacastService: Service<typeof makeDacastService>
	contentService: Service<typeof makeContentService>
}
