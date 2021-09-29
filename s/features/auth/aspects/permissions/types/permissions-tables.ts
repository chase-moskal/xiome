
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {AsDbbyRow, DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"

export type PermissionsTables = {
	role: DbbyTable<RoleRow>
	privilege: DbbyTable<PrivilegeRow>
	userHasRole: DbbyTable<UserHasRoleRow>
	roleHasPrivilege: DbbyTable<RoleHasPrivilegeRow>
}

export type RoleRow = AsDbbyRow<{
	roleId: DamnId
	label: string
	time: number

	// hardcoded roles cannot be deleted
	hard: boolean

	// public roles are visible to anybody
	public: boolean

	// assignable roles can be freely assigned/revoked by admins
	assignable: boolean
}>

export type PrivilegeRow = AsDbbyRow<{
	privilegeId: DamnId
	label: string
	hard: boolean
	time: number
}>

export type UserHasRoleRow = AsDbbyRow<{
	userId: DamnId
	roleId: DamnId
	timeframeStart: undefined | number
	timeframeEnd: undefined | number
	public: boolean
	hard: boolean
	time: number
}>

export type RoleHasPrivilegeRow = AsDbbyRow<{
	roleId: DamnId
	privilegeId: DamnId
	immutable: boolean
	active: boolean
	time: number
}>
