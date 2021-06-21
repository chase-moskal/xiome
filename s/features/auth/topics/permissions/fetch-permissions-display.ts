
import {AccessPayload} from "../../types/tokens/access-payload.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {PermissionsTables} from "../../tables/types/table-groups/permissions-tables.js"
import {makePermissionsEngine} from "../../../../assembly/backend/permissions2/permissions-engine.js"

export async function fetchPermissionsDisplay({
		config, access, permissionsTables,
	}: {
		config: SecretConfig
		access: AccessPayload
		permissionsTables: PermissionsTables
	}) {

	const permissionsEngine = makePermissionsEngine({
		permissionsTables,
		isPlatform: access.appId === config.platform.appDetails.appId,
	})

	return permissionsEngine.getPermissionsDisplay()
}
