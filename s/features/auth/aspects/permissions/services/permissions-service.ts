
import {ApiError} from "renraku/x/api/api-error.js"
import {apiContext} from "renraku/x/api/api-context.js"

import {AuthOptions} from "../../../types/auth-options.js"
import {UserAuth, UserMeta} from "../../../types/auth-metas.js"
import {find} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {fetchPermissionsDisplay} from "../../users/routines/permissions/fetch-permissions-display.js"
import {roleLabelValidator} from "../../users/routines/permissions/validators/role-label-validator.js"

export const makePermissionsService = ({
		rando, config, authPolicies,
	}: AuthOptions) => apiContext<UserMeta, UserAuth>()({
	policy: async(meta, request) => {
		const auth = await authPolicies.userPolicy(meta, request)
		auth.checker.requirePrivilege("customize permissions")
		return auth
	},
	expose: {

		async fetchPermissions({access, authTables}) {
			return fetchPermissionsDisplay({
				config,
				access,
				permissionsTables: authTables.permissions,
			})
		},
	
		async createRole({authTables}, {label}: {label: string}) {
			const problems = roleLabelValidator(label)
			if (problems.length) throw new ApiError(
				400,
				`validation error on label: ${problems.join("; ")}`
			)
			await authTables.permissions.role.create({
				label,
				hard: false,
				public: true,
				assignable: true,
				roleId: rando.randomId(),
			})
		},
	
		async deleteRole({authTables}, {roleId: roleIdString}: {roleId: string}) {
			const roleId = DamnId.fromString(roleIdString)
			const role = await authTables.permissions.role.one(find({roleId}))
	
			if (!role)
				throw new ApiError(404, "role not found")
	
			if (role.hard)
				throw new ApiError(400, "cannot delete hard role")
	
			await Promise.all([
				authTables.permissions.userHasRole.delete(find({roleId})),
				authTables.permissions.role.delete(find({roleId})),
			])
		},
	
		async assignPrivilege({authTables}, {roleId: roleIdString, privilegeId: privilegeIdString}: {
				roleId: string
				privilegeId: string
			}) {
			const roleId = DamnId.fromString(roleIdString)
			const privilegeId = DamnId.fromString(privilegeIdString)
			await authTables.permissions.roleHasPrivilege.update({
				...find({roleId, privilegeId}),
				upsert: {
					roleId,
					privilegeId,
					active: true,
					immutable: false,
				},
			})
		},
	
		async unassignPrivilege({authTables}, {roleId: roleIdString, privilegeId: privilegeIdString}: {
				roleId: string
				privilegeId: string
			}) {
			const roleId = DamnId.fromString(roleIdString)
			const privilegeId = DamnId.fromString(privilegeIdString)
			await authTables.permissions.roleHasPrivilege.update({
				...find({roleId, privilegeId}),
				upsert: {
					roleId,
					privilegeId,
					active: false,
					immutable: false,
				},
			})
		},

		async deletePrivilege({authTables}, {privilegeId: privilegeIdString}: {
				privilegeId: string
			}) {
			const privilegeId = DamnId.fromString(privilegeIdString)
			await Promise.all([
				authTables.permissions
					.roleHasPrivilege.delete(find({privilegeId})),
				authTables.permissions
					.privilege.delete(find({privilegeId})),
			])
		},
	},
})
