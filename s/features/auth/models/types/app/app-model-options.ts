
import {appTopic} from "../../../topics/app-topic.js"

import {AccessPayload} from "../../../auth-types.js"
import {Service} from "../../../../../types/service.js"

export interface AppModelOptions {
	appService: Service<typeof appTopic>
	getAccess: () => Promise<AccessPayload>
}
