
import {HardcodedPermissions, PrivilegeRow, RolePrivilegeRow, RoleRow} from "../auth-types.js"

export function prepareHardPermissions(blueprint: {
			inherit?: HardcodedPermissions
			roles: {[label: string]: {
				roleId: string
				privileges: string[]
			}}
			privileges: {[label: string]: string}
		}): HardcodedPermissions {
	const {inherit = {roles: [], privileges: [], userRoles: [], rolePrivileges: []}} = blueprint

	const privileges: PrivilegeRow[] = [
		...inherit.privileges,
		...Object.entries(blueprint.privileges)
			.map(([label, privilegeId]) => ({label, privilegeId})),
	]

	const roles: RoleRow[] = [
		...inherit.roles,
		...Object.entries(blueprint.roles)
			.map(([label, {roleId}]) => ({roleId, label})),
	]

	const rolePrivileges: RolePrivilegeRow[] = [
		...inherit.rolePrivileges,
		...Object.entries(blueprint.roles)
			.map(([,{roleId, privileges: privilegeLabels}]) => privilegeLabels.map(label => {
				const privilege = privileges.find(row => row.label === label)
				if (!privilege) throw new Error(`hardcoded permission label not found "${label}"`)
				return {roleId, privilegeId: privilege.privilegeId}
			}))
			.flat(),
	]

	return {
		roles,
		privileges,
		rolePrivileges,
		userRoles: [],
	}
}
