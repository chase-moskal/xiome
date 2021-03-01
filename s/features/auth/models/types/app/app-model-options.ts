
import {appTopic} from "../../../topics/app-topic.js"
import {manageAdminsTopic} from "../../../topics/manage-admins-topic.js"

import {AccessPayload} from "../../../types/tokens/access-payload.js"
import {Service} from "../../../../../types/service.js"

export interface AppModelOptions {
	appService: Service<typeof appTopic>
	manageAdminsService: Service<typeof manageAdminsTopic>
	getAccess: () => Promise<AccessPayload>
}
