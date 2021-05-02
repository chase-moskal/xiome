
import {AuthTables} from "../../tables/types/auth-tables.js"
import {AccessPayload} from "../../types/tokens/access-payload.js"
import {PlatformConfig} from "../../../../assembly/backend/types/platform-config.js"

export function isUserAllowedToEditProfile({access}: {
		tables: AuthTables
		access: AccessPayload
		config: PlatformConfig
	}) {

	console.warn("TODO implement isUserAllowedToEditProfile")

	// TODO implement
	return true
}
