
import {UserAuth, AuthOptions} from "../auth-types.js"
import {asTopic} from "renraku/x/identities/as-topic.js"
import {concurrent} from "../../../toolbox/concurrent.js"
import {PermissionsDisplay} from "./permissions/types/permissions-display.js"

export const permissionsTopic = ({}: AuthOptions) => asTopic<UserAuth>()({

	async fetchPermissions({tables}): Promise<PermissionsDisplay> {
		const all: {conditions: false} = {conditions: false}
		return concurrent({
			roles: tables.role.read(all).then(
				rows => rows.map(row => ({
					roleId: row.roleId,
					label: row.label,
					hard: !!row.hard,
				}))
			),
			privileges: tables.privilege.read(all).then(
				rows => rows.map(row => ({
					privilegeId: row.privilegeId,
					label: row.label,
				}))
			),
			rolesHavePrivileges: tables.roleHasPrivilege.read(all).then(
				rows => rows.map(row => ({
					privilegeId: row.privilegeId,
					roleId: row.roleId,
				}))
			),
		})
	},

	async createRole({}, {}: {label: string}) {
		console.log("TODO: createRole")
	},

	async deleteRole({}, {}: {roleId: string}) {
		console.log("TODO: deleteRole")
	},

	async createPrivilege({}, {}: {label: string}) {
		console.log("TODO: createPrivilege")
	},

	async deletePrivilege({}, {}: {privilegeId: string}) {
		console.log("TODO: deletePrivilege")
	},

	async assignPrivilege({}, {}: {
			roleId: string
			privilegeId: string
		}) {
		console.log("TODO: assignPrivilege")
	},

	async unassignPrivilege({}, {}: {
			roleId: string
			privilegeId: string
		}) {
		console.log("TODO: unassignPrivilege")
	},

	async grantRole({}, {}: {
			userId: string
			roleId: string
			timeframeStart: number
			timeframeEnd: number
		}) {
		console.log("TODO: grantRole")
	},

	async revokeRole({}, {}: {
			userId: string
			roleId: string
		}) {
		console.log("TODO: revokeRole")
	},
})
