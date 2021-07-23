
import {AccessPayload} from "../../../../auth/types/auth-tokens.js"
import {appPermissions} from "../../../../../assembly/backend/permissions/standard-permissions.js"

export function userCanManageStore(access: AccessPayload) {
	const privileges = access?.permit.privileges
	return privileges
		? privileges.includes(appPermissions.privileges["manage store"])
		: false
}
