
type HasPrivilege = {customizable: boolean}
type Privileges = {[key: string]: string}
type Role<xPrivileges extends Privileges> = {
	roleId: string
	hasPrivileges: Partial<{[P in keyof xPrivileges]: HasPrivilege}>
}

export function asPermissions<
		xPrivileges extends Privileges,
	>(permissions: {privileges: xPrivileges, roles: {[key: string]: Role<xPrivileges>}}) {
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

export function customizable<xPrivileges extends Privileges>(privileges: xPrivileges) {
	return has<xPrivileges>(privileges, {customizable: true})
}

export function hardcoded<xPrivileges extends Privileges>(privileges: xPrivileges) {
	return has<xPrivileges>(privileges, {customizable: false})
}
