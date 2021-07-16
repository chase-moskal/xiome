
import {asApi} from "renraku/x/identities/as-api.js"

import {manageApps} from "./services/manage-apps.js"
import {manageAdmins} from "./services/manage-admins.js"
import {AppsApiOptions} from "./types/apps-api-options.js"

export function appsApi(options: AppsApiOptions) {
	return asApi({
		manageApps: manageApps(options),
		manageAdmins: manageAdmins(options),
	})
}
