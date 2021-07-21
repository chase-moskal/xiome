
import {Service} from "../../../../../../types/service.js"
import {makePermissionsService} from "../../services/permissions-service.js"

export interface PermissionsModelOptions {
	permissionsService: Service<typeof makePermissionsService>
	reauthorize: () => Promise<void>
}
