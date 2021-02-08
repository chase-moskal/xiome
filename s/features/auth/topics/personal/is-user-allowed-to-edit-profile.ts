
import {AccessPayload, App, AuthTables, PlatformConfig} from "../../auth-types.js";

export function isUserAllowedToEditProfile({app, access}: {
		app: App
		tables: AuthTables
		access: AccessPayload
		config: PlatformConfig
	}) {

	// TODO implement
	return true
}
