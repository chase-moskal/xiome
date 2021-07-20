
import {Service2} from "../../../../../../types/service2.js"
import {makePermissionsService} from "../../services/permissions-service.js"

export interface PermissionsModelOptions {
	permissionsService: Service2<typeof makePermissionsService>
	reauthorize: () => Promise<void>
}
