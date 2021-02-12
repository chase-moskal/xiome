
import {personalTopic} from "../../../topics/personal-topic.js"

import {AccessPayload} from "../../../auth-types.js"
import {Service} from "../../../../../types/service.js"
import {LoadingView} from "../../../../../framework/loading/types/loading-view.js"

export interface PersonalModelOptions {
	personalService: Service<typeof personalTopic>
	reauthorize: () => Promise<void>
	getAccess: () => Promise<AccessPayload>
}
