
import {appPermissions} from "./permissions/app-permissions.js"
import {platformPermissions} from "./permissions/platform-permissions.js"

export const hardPermissions = {
	app: appPermissions,
	platform: platformPermissions,
}
