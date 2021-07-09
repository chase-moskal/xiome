
import {ApiError} from "renraku/x/api/api-error.js"
import {find} from "../../../toolbox/dbby/dbby-x.js"
import {UserAuth} from "../policies/types/user-auth.js"
import {asTopic} from "renraku/x/identities/as-topic.js"
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
			id_role: rando.randomId(),
		})
	},

	async deleteRole({tables}, {id_role}: {id_role: string}) {
		const role = await tables.permissions.role.one(find({id_role}))

		if (!role)
			throw new ApiError(404, "role not found")

		if (role.hard)
			throw new ApiError(400, "cannot delete hard role")

		await Promise.all([
			tables.permissions.userHasRole.delete(find({id_role})),
			tables.permissions.role.delete(find({id_role})),
		])
	},

	async assignPrivilege({tables}, {id_role, id_privilege}: {
			id_role: string
			id_privilege: string
		}) {
		await tables.permissions.roleHasPrivilege.update({
			...find({id_role, id_privilege}),
			upsert: {
				id_role,
				id_privilege,
				active: true,
				immutable: false,
			},
		})
	},

	async unassignPrivilege({tables}, {id_role, id_privilege}: {
			id_role: string
			id_privilege: string
		}) {
		await tables.permissions.roleHasPrivilege.update({
			...find({id_role, id_privilege}),
			upsert: {
				id_role,
				id_privilege,
				active: false,
				immutable: false,
			},
		})
	},
})
