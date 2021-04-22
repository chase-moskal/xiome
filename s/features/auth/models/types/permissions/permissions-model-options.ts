
import {AccessPayload} from "../../../types/tokens/access-payload.js"
import {Service} from "../../../../../types/service.js"
import {permissionsTopic} from "../../../topics/permissions-topic.js"

export interface PermissionsModelOptions {
	permissionsService: Service<typeof permissionsTopic>
}
