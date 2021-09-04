
import {Op} from "../../../../../../framework/ops.js"
import {Service} from "../../../../../../types/service.js"
import {AccessPayload} from "../../../../types/auth-tokens.js"
import {makePersonalService} from "../../services/personal-service.js"

export interface PersonalModelOptions {
	personalService: Service<typeof makePersonalService>
	reauthorize: () => Promise<void>
	getAccessOp: () => Op<AccessPayload>
}
