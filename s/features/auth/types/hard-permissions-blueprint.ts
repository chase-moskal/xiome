import {HardPermissions} from "./hard-permissions"


export interface HardPermissionsBlueprint {
	inherit?: HardPermissions
	privileges: {[label: string]: string}
	roles: {
		[label: string]: {
			roleId: string
			privileges: string[]
		}
	}
}
