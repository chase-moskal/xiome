
import {AccessPayload} from "../../../../auth/types/tokens/access-payload.js"
import {appPrivileges} from "../../../../../assembly/backend/permissions/standard/app/app-privileges.js"

export function isAllowedToPlanSubscriptions(access: AccessPayload) {
	return access.permit.privileges.includes(
		appPrivileges["manage products and subscription plans"]
	)
}
