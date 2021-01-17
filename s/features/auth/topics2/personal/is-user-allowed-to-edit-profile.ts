
import {AccessPayload, AppPayload, AuthTables, PlatformConfig} from "../../auth-types.js";

export function isUserAllowedToEditProfile({app, access}: {
		app: AppPayload
		tables: AuthTables
		access: AccessPayload
		config: PlatformConfig
	}) {

	// TODO implement
	return true
}
