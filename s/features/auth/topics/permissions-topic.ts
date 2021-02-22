
import {ApiError} from "renraku/x/api/api-error.js"
import {UserAuth, AuthOptions} from "../auth-types.js"
import {asTopic} from "renraku/x/identities/as-topic.js"
import {concurrent} from "../../../toolbox/concurrent.js"
import {PermissionsDisplay} from "./permissions/types/permissions-display.js"
import {roleLabelValidator} from "./permissions/validators/role-label-validator.js"
import {find} from "../../../toolbox/dbby/dbby-x.js"

export const permissionsTopic = ({rando}: AuthOptions) => asTopic<UserAuth>()({

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
					hard: !!row.hard,
				}))
			),
			rolesHavePrivileges: tables.roleHasPrivilege.read(all).then(
				rows => rows.map(row => ({
					privilegeId: row.privilegeId,
					roleId: row.roleId,
					hard: !!row.hard,
				}))
			),
		})
	},

	async createRole({tables}, {label}: {label: string}) {
		const problems = roleLabelValidator(label)
		if (problems.length) throw new ApiError(
			400,
			`validation error on label: ${problems.join("; ")}`
		)
		await tables.role.create({
			hard: false,
			label,
			roleId: rando.randomId(),
		})
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

	async assignPrivilege({tables}, {roleId, privilegeId}: {
			roleId: string
			privilegeId: string
		}) {
		await tables.roleHasPrivilege.create({
			hard: false,
			roleId,
			privilegeId,
		})
	},

	async unassignPrivilege({tables}, {roleId, privilegeId}: {
			roleId: string
			privilegeId: string
		}) {
		await tables.roleHasPrivilege.delete(find({
			hard: false,
			roleId,
			privilegeId,
		}))
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
