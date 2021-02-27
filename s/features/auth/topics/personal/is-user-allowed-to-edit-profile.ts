
import {AuthTables} from "../../tables/types/auth-tables.js"
import {AccessPayload, App, PlatformConfig} from "../../auth-types.js";

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
