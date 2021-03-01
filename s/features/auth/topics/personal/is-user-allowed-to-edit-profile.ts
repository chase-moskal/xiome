
import {AuthTables} from "../../tables/types/auth-tables.js"
import {AccessPayload} from "../../types/access-payload"
import {App} from "../../types/app"
import {PlatformConfig} from "../../types/platform-config"

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
