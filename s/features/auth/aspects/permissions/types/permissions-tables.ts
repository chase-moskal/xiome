
import * as dbmage from "dbmage"

export type PermissionsSchema = dbmage.AsSchema<{
	role: RoleRow
	privilege: PrivilegeRow
	userHasRole: UserHasRoleRow
	roleHasPrivilege: RoleHasPrivilegeRow
}>

export type RoleRow = dbmage.AsRow<{
	roleId: dbmage.Id
	label: string
	time: number

	// hardcoded roles cannot be deleted
	hard: boolean

	// public roles are visible to anybody
	public: boolean

	// assignable roles can be freely assigned/revoked by admins
	assignable: boolean
}>

export type PrivilegeRow = dbmage.AsRow<{
	privilegeId: dbmage.Id
	label: string
	hard: boolean
	time: number
}>

export type UserHasRoleRow = dbmage.AsRow<{
	userId: dbmage.Id
	roleId: dbmage.Id
	timeframeStart: undefined | number
	timeframeEnd: undefined | number
	public: boolean
	hard: boolean
	time: number
}>

export type RoleHasPrivilegeRow = dbmage.AsRow<{
	roleId: dbmage.Id
	privilegeId: dbmage.Id
	immutable: boolean
	active: boolean
	time: number
}>
