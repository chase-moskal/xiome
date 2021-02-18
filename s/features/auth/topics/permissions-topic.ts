
import {UserAuth, AuthOptions} from "../auth-types.js"
import {asTopic} from "renraku/x/identities/as-topic.js"
import {concurrent} from "../../../toolbox/concurrent.js"

export const permissionsTopic = ({}: AuthOptions) => asTopic<UserAuth>()({

	async fetchAllPermissions({tables}) {
		const all: {conditions: false} = {conditions: false}
		const allPermissions = await concurrent({
			roles: tables.role.read(all),
			privileges: tables.privilege.read(all),
			rolesHavePrivileges: tables.roleHasPrivilege.read(all),
		})
		return allPermissions
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
