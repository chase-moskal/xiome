import {HardPermissions} from "./HardPermissions"


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
