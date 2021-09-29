
import {UserAuth, UserMeta} from "../../../types/auth-metas.js"
import {makePermissionsEngine} from "../../../../../assembly/backend/permissions/permissions-engine.js"

export interface PermissionsMeta extends UserMeta {}

export interface PermissionsAuth extends UserAuth {
	engine: ReturnType<typeof makePermissionsEngine>
}
