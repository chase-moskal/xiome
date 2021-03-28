
import {appTopic} from "../../../topics/app-topic.js"
import {manageAdminsTopic} from "../../../topics/manage-admins-topic.js"

import {Service} from "../../../../../types/service.js"
import {AccessPayload} from "../../../types/tokens/access-payload.js"
import {appEditTopic} from "../../../topics/app-edit-topic.js"

export interface AppModelOptions {
	appService: Service<typeof appTopic>
	appEditService: Service<typeof appEditTopic>
	manageAdminsService: Service<typeof manageAdminsTopic>
	getAccess: () => Promise<AccessPayload>
}
