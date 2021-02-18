
export interface PermissionsDisplay {
	roles: {
		roleId: string
		label: string
	}[]
	privileges: {
		privilegeId: string
		label: string
	}[]
	rolesHavePrivileges: {
		roleId: string
		privilegeId: string
	}[]
}
