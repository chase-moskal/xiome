
import {AccessPayload} from "../../../../auth2/types/auth-tokens.js"
import {appPermissions} from "../../../../../assembly/backend/permissions2/standard-permissions.js"

export function userCanManageStore(access: AccessPayload) {
	const privileges = access?.permit.privileges
	return privileges
		? privileges.includes(appPermissions.privileges["manage store"])
		: false
}
