
import {ApiError} from "renraku/x/api/api-error.js"
import {find} from "../../../toolbox/dbby/dbby-x.js"
import {UserAuth} from "../policies/types/user-auth.js"
import {asTopic} from "renraku/x/identities/as-topic.js"
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {AuthApiOptions} from "../types/auth-api-options.js"
import {fetchPermissionsDisplay} from "./permissions/fetch-permissions-display.js"
import {roleLabelValidator} from "./permissions/validators/role-label-validator.js"

export const permissionsTopic = ({config, rando}: AuthApiOptions) => asTopic<UserAuth>()({

	async fetchPermissions({tables, access}) {
		return fetchPermissionsDisplay({
			config,
			access,
			permissionsTables: tables.permissions,
		})
	},

	async createRole({tables}, {label}: {label: string}) {
		const problems = roleLabelValidator(label)
		if (problems.length) throw new ApiError(
			400,
			`validation error on label: ${problems.join("; ")}`
		)
		await tables.permissions.role.create({
			label,
			hard: false,
			public: true,
			assignable: true,
			roleId: rando.randomId(),
		})
	},

	async deleteRole({tables}, {roleId: roleIdString}: {roleId: string}) {
		const roleId = DamnId.fromString(roleIdString)
		const role = await tables.permissions.role.one(find({roleId}))

		if (!role)
			throw new ApiError(404, "role not found")

		if (role.hard)
			throw new ApiError(400, "cannot delete hard role")

		await Promise.all([
			tables.permissions.userHasRole.delete(find({roleId})),
			tables.permissions.role.delete(find({roleId})),
		])
	},

	async assignPrivilege({tables}, {roleId: roleIdString, privilegeId: privilegeIdString}: {
			roleId: string
			privilegeId: string
		}) {
		const roleId = DamnId.fromString(roleIdString)
		const privilegeId = DamnId.fromString(privilegeIdString)
		await tables.permissions.roleHasPrivilege.update({
			...find({roleId, privilegeId}),
			upsert: {
				roleId,
				privilegeId,
				active: true,
				immutable: false,
			},
		})
	},

	async unassignPrivilege({tables}, {roleId: roleIdString, privilegeId: privilegeIdString}: {
			roleId: string
			privilegeId: string
		}) {
		const roleId = DamnId.fromString(roleIdString)
		const privilegeId = DamnId.fromString(privilegeIdString)
		await tables.permissions.roleHasPrivilege.update({
			...find({roleId, privilegeId}),
			upsert: {
				roleId,
				privilegeId,
				active: false,
				immutable: false,
			},
		})
	},
})
