
import {makeAppService} from "../../services/app-service.js"
import {Service} from "../../../../../../types/service.js"
import {AccessPayload} from "../../../../types/auth-tokens.js"
import {makeAppEditService} from "../../services/app-edit-service.js"

export interface AppModelOptions {
	appService: Service<typeof makeAppService>
	appEditService: Service<typeof makeAppEditService>
	getValidAccess: () => Promise<AccessPayload>
}
