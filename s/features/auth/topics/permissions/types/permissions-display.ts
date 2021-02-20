
export interface PermissionsDisplay {
	roles: {
		roleId: string
		label: string
		hard: boolean
	}[]
	privileges: {
		privilegeId: string
		label: string
		hard: boolean
	}[]
	rolesHavePrivileges: {
		roleId: string
		privilegeId: string
		hard: boolean
	}[]
}
