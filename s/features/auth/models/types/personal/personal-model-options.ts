
import {personalTopic} from "../../../topics/personal-topic.js"

import {AccessPayload} from "../../../auth-types.js"
import {Service} from "../../../../../types/service.js"

export interface PersonalModelOptions {
	reauthorize: () => Promise<void>
	getAccess: () => Promise<AccessPayload>
	personalService: Service<typeof personalTopic>
}
