
import {AuthTables} from "../../tables/types/auth-tables.js"
import {AccessPayload} from "../../types/tokens/access-payload.js"
import {App} from "../../types/tokens/app.js"
import {PlatformConfig} from "../../../../assembly/backend/types/platform-config.js"

export function isUserAllowedToEditProfile({app, access}: {
		app: App
		tables: AuthTables
		access: AccessPayload
		config: PlatformConfig
	}) {

	console.warn("TODO implement isUserAllowedToEditProfile")

	// TODO implement
	return true
}
