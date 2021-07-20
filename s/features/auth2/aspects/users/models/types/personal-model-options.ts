
import {Service2} from "../../../../../../types/service2.js"
import {AccessPayload} from "../../../../types/auth-tokens.js"
import {makePersonalService} from "../../services/personal-service.js"

export interface PersonalModelOptions {
	personalService: Service2<typeof makePersonalService>
	reauthorize: () => Promise<void>
	getAccess: () => Promise<AccessPayload>
}
