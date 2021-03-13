
import {appPermissions} from "./standard/app-permissions.js"
import {platformPermissions} from "./standard/platform-permissions.js"
import {buildHardPermissions} from "./build/build-hard-permissions.js"

export const hardPermissions = {
	app: buildHardPermissions(appPermissions),
	platform: buildHardPermissions(platformPermissions),
}
