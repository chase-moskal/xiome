
import {AccessPayload} from "../../../types/AccessPayload"
import {Service} from "../../../../../types/service.js"
import {permissionsTopic} from "../../../topics/permissions-topic.js"

export interface PermissionsModelOptions {
	getAccess: () => Promise<AccessPayload>
	permissionsService: Service<typeof permissionsTopic>
}
