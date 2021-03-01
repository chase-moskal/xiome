
import {AuthTables} from "../../tables/types/auth-tables.js"
import {AccessPayload} from "../../types/AccessPayload"
import {App} from "../../types/App"
import {PlatformConfig} from "../../types/PlatformConfig"

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
