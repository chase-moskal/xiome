
import {AccessPayload} from "../../types/tokens/access-payload.js"
import {PlatformConfig} from "../../../../assembly/backend/types/platform-config.js"
import {PermissionsTables} from "../../tables/types/table-groups/permissions-tables.js"
import {makePermissionsEngine} from "../../../../assembly/backend/permissions2/permissions-engine.js"

export async function fetchPermissionsDisplay({
		config, access, permissionsTables,
	}: {
		config: PlatformConfig
		access: AccessPayload
		permissionsTables: PermissionsTables
	}) {

	const permissionsEngine = makePermissionsEngine({
		permissionsTables,
		isPlatform: access.appId === config.platform.appDetails.appId,
	})

	return permissionsEngine.getPermissionsDisplay()
}
