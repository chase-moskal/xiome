
type HasPrivilege = {active: boolean, immutable: boolean}
type Role<xPrivileges extends Privileges> = {
	roleId: string
	public: boolean
	assignable: boolean
	hasPrivileges: Partial<{[P in keyof xPrivileges]: HasPrivilege}>
}

export type Privileges = {[key: string]: string}
export type Roles<xPrivileges extends Privileges> = {[key: string]: Role<xPrivileges>}

export type Permissions<
	xPrivileges extends Privileges,
	xRoles extends Roles<xPrivileges>
> = {privileges: xPrivileges, roles: xRoles}

export type AnyPermissions = Permissions<Privileges, Roles<Privileges>>

export function asPermissions<
		xPrivileges extends Privileges,
		xRoles extends Roles<xPrivileges>
	>(permissions: Permissions<xPrivileges, xRoles>) {
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
