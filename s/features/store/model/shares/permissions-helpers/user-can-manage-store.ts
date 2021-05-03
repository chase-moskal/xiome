
import {appPermissions} from "../../../../../assembly/backend/permissions2/standard-permissions.js"
import {AccessPayload} from "../../../../auth/types/tokens/access-payload.js"

export function userCanManageStore(access: AccessPayload) {
	const privileges = access?.permit.privileges
	return privileges
		? privileges.includes(appPermissions.privileges["manage store"])
		: false
}
