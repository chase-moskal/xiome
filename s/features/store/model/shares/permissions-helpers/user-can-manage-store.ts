
import {AccessPayload} from "../../../../auth/types/tokens/access-payload.js"
import {appPermissions} from "../../../../../assembly/backend/permissions/standard/app-permissions.js"

export function userCanManageStore(access: AccessPayload) {
	const privileges = access?.permit.privileges
	return privileges
		? privileges.includes(appPermissions.privileges["manage store"])
		: false
}
