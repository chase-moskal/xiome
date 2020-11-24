
import {PlatformConfig, AppPayload, AccessPayload} from "../../auth-types.js"
import {getPrivilegeIdsForUser} from "./privileges/get-privilege-ids-for-user.js"

export function doesUserHaveHardPrivilege({label, app, access, config}: {
			label: string
			app: AppPayload
			access: AccessPayload
			config: PlatformConfig
		}) {

	const permissions = app.platform
		? config.permissions.platform
		: config.permissions.app

	const privilegeIds = getPrivilegeIdsForUser(permissions, access.user.userId)
	const targetPrivilegeId = permissions.privileges
		.find(privilege => privilege.label === label)
		.privilegeId

	return privilegeIds.includes(targetPrivilegeId)
}
