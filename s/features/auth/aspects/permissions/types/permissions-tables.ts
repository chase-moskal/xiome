
import * as dbproxy from "../../../../../toolbox/dbproxy/dbproxy.js"

export type PermissionsSchema = dbproxy.AsSchema<{
	role: RoleRow
	privilege: PrivilegeRow
	userHasRole: UserHasRoleRow
	roleHasPrivilege: RoleHasPrivilegeRow
}>

export type RoleRow = dbproxy.AsRow<{
	roleId: dbproxy.Id
	label: string
	time: number

	// hardcoded roles cannot be deleted
	hard: boolean

	// public roles are visible to anybody
	public: boolean

	// assignable roles can be freely assigned/revoked by admins
	assignable: boolean
}>

export type PrivilegeRow = dbproxy.AsRow<{
	privilegeId: dbproxy.Id
	label: string
	hard: boolean
	time: number
}>

export type UserHasRoleRow = dbproxy.AsRow<{
	userId: dbproxy.Id
	roleId: dbproxy.Id
	timeframeStart: undefined | number
	timeframeEnd: undefined | number
	public: boolean
	hard: boolean
	time: number
}>

export type RoleHasPrivilegeRow = dbproxy.AsRow<{
	roleId: dbproxy.Id
	privilegeId: dbproxy.Id
	immutable: boolean
	active: boolean
	time: number
}>
