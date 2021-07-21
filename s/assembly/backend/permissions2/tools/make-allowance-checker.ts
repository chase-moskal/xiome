
import {Privileges} from "../permissions-helpers.js"
import {AccessPayload} from "../../../../features/auth/types/auth-tokens.js"

export function makeAllowanceChecker<xPrivileges extends Privileges>(
		access: AccessPayload,
		privileges: xPrivileges,
	) {

	const allowed = {}

	for (const [key, privilegeId] of Object.entries(privileges))
		allowed[key] = access
			? access.permit.privileges.includes(privilegeId)
			: false

	return (privilege: keyof xPrivileges): boolean => (<any>allowed)[privilege]
}
