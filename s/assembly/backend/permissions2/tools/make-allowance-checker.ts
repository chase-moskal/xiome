
import {Privileges} from "../permissions-helpers.js"
import {AccessPayload} from "../../../../features/auth/types/tokens/access-payload.js"

export function makeAllowanceChecker<xPrivileges extends Privileges>(
		access: AccessPayload,
		privileges: xPrivileges,
	) {

	const allowed = {}

	for (const [key, id_privilege] of Object.entries(privileges))
		allowed[key] = access
			? access.permit.privileges.includes(id_privilege)
			: false

	return (privilege: keyof xPrivileges): boolean => (<any>allowed)[privilege]
}
