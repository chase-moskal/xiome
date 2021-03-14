
export interface RolesBlueprint {
	[label: string]: {
		roleId: string
		privileges: {[label: string]: string}
	}
}
