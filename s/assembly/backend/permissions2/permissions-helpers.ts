
type HasPrivilege = {active: boolean, immutable: boolean}
type Privileges = {[key: string]: string}
type Role<xPrivileges extends Privileges> = {
	roleId: string
	hasPrivileges: Partial<{[P in keyof xPrivileges]: HasPrivilege}>
}

export function asPermissions<
		xPrivileges extends Privileges,
		xRoles extends {[key: string]: Role<xPrivileges>}
	>(permissions: {privileges: xPrivileges, roles: xRoles}) {
	return permissions
}

export function has<xPrivileges extends Privileges>(
		privileges: xPrivileges,
		hasPrivilege: HasPrivilege,
	) {
	const hasPrivileges: {[key: string]: HasPrivilege} = {}
	for (const key of Object.keys(privileges))
		hasPrivileges[key] = hasPrivilege
	return <{[P in keyof xPrivileges]: HasPrivilege}>hasPrivileges
}

export function mutable<xPrivileges extends Privileges>(active: boolean, privileges: xPrivileges) {
	return has<xPrivileges>(privileges, {active, immutable: false})
}

export function immutable<xPrivileges extends Privileges>(active: boolean, privileges: xPrivileges) {
	return has<xPrivileges>(privileges, {active, immutable: true})
}
