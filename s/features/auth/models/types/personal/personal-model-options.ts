
import {personalTopic} from "../../../topics/personal-topic.js"

import {AccessPayload} from "../../../types/tokens/access-payload.js"
import {Service} from "../../../../../types/service.js"

export interface PersonalModelOptions {
	personalService: Service<typeof personalTopic>
	reauthorize: () => Promise<void>
	getAccess: () => Promise<AccessPayload>
}
