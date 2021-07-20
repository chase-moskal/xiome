
import {makeAppService} from "../../services/app-service.js"
import {Service2} from "../../../../../../types/service2.js"
import {AccessPayload} from "../../../../types/auth-tokens.js"
import {makeAppEditService} from "../../services/app-edit-service.js"

export interface AppModelOptions {
	appService: Service2<typeof makeAppService>
	appEditService: Service2<typeof makeAppEditService>
	getAccess: () => Promise<AccessPayload>
}
