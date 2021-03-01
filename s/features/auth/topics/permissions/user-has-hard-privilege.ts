
import {AccessPayload, PlatformConfig} from "../../types/auth-types.js"

export function userHasHardPrivilege({config, access, privilegeLabel}: {
		config: PlatformConfig,
		access: AccessPayload,
		privilegeLabel: string,
	}) {

	const hardPrivilege = config.permissions.app.privileges
		.find(({label}) => label === privilegeLabel)

	const userPrivileges = access.permit.privileges

	return userPrivileges.includes(hardPrivilege.privilegeId)
}
