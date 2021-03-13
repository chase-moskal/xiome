
import {RolesBlueprint} from "./roles-blueprint.js"
import {PrivilegesBlueprint} from "./privilege-blueprint.js"

export interface HardPermissionsBlueprint {
	roles: RolesBlueprint
	privileges: PrivilegesBlueprint
}
