
import {ApiError} from "renraku/x/api/api-error.js"
import {userHasHardPrivilege} from "./user-has-hard-privilege.js"
import {AccessPayload} from "../../types/access-payload.js"
import {PlatformConfig} from "../../types/platform-config.js"

export function requireUserCanManagePermissions({config, access}: {
		config: PlatformConfig,
		access: AccessPayload,
	}) {

	if (!userHasHardPrivilege({
		config,
		access,
		privilegeLabel: "manage_permissions",
	})) throw new ApiError(403, "forbidden: not allowed to manage permissions")
}
