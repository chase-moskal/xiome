
import {ApiError} from "renraku/x/api/api-error.js"
import {find} from "../../../toolbox/dbby/dbby-x.js"
import {UserAuth} from "../policies/types/user-auth.js"
import {asTopic} from "renraku/x/identities/as-topic.js"
import {AuthApiOptions} from "../types/auth-api-options.js"
import {PermissionsDisplay} from "./permissions/types/permissions-display.js"
import {roleLabelValidator} from "./permissions/validators/role-label-validator.js"
import {makePermissionsEngine} from "../../../assembly/backend/permissions2/permissions-engine.js"

export const permissionsTopic = ({config, rando}: AuthApiOptions) => asTopic<UserAuth>()({

	async fetchPermissions({tables, access}): Promise<PermissionsDisplay> {
		const permissionsEngine = makePermissionsEngine({
			isPlatform: access.appId === config.platform.appDetails.appId,
			permissionsTables: tables.permissions,
		})
		return permissionsEngine.getPermissionsDisplay()
	},

	async createRole({tables}, {label}: {label: string}) {
		const problems = roleLabelValidator(label)
		if (problems.length) throw new ApiError(
			400,
			`validation error on label: ${problems.join("; ")}`
		)
		await tables.permissions.role.create({
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
		await tables.permissions.roleHasPrivilege.update({
			...find({roleId, privilegeId}),
			upsert: {
				roleId,
				privilegeId,
				active: true,
				customizable: true,
			},
		})
	},

	async unassignPrivilege({tables}, {roleId, privilegeId}: {
			roleId: string
			privilegeId: string
		}) {
		await tables.permissions.roleHasPrivilege.update({
			...find({roleId, privilegeId}),
			upsert: {
				roleId,
				privilegeId,
				active: false,
				customizable: true,
			},
		})
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
