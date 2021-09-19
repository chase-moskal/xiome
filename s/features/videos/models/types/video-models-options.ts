
import {Service} from "../../../../types/service.js"
import {makeDacastService} from "../../api/services/dacast-service.js"

export interface VideoModelsOptions {
	dacastService: Service<typeof makeDacastService>
}
