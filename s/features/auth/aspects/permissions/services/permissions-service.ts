
import {ApiError} from "renraku/x/api/api-error.js"
import {apiContext} from "renraku/x/api/api-context.js"

import {AuthOptions} from "../../../types/auth-options.js"
import {find} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {PermissionsAuth, PermissionsMeta} from "../types/permissions-auth-and-metas.js"
import {roleLabelValidator} from "../../users/routines/permissions/validators/role-label-validator.js"
import {makePermissionsEngine} from "../../../../../assembly/backend/permissions/permissions-engine.js"
import {PrivilegeRow} from "../types/permissions-tables.js"
import {PrivilegeDisplay} from "../../users/routines/permissions/types/privilege-display.js"

export const makePermissionsService = ({
		rando, config, authPolicies,
	}: AuthOptions) => apiContext<PermissionsMeta, PermissionsAuth>()({

	policy: async(meta, request) => {
		const auth = await authPolicies.userPolicy(meta, request)
		auth.checker.requirePrivilege("customize permissions")
		const engine = makePermissionsEngine({
			permissionsTables: auth.authTables.permissions,
			isPlatform: auth.access.appId === config.platform.appDetails.appId,
		})
		return {...auth, engine}
	},

	expose: {

		async fetchPermissions({engine}) {
			return engine.getPermissionsDisplay()
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

		async createPrivilege({authTables}, {label}: {label: string}): Promise<PrivilegeDisplay> {
			const privilege: PrivilegeRow = {
				label,
				hard: false,
				privilegeId: rando.randomId()
			}
			await authTables.permissions.privilege.create(privilege)
			return {
				hard: privilege.hard,
				label: privilege.label,
				privilegeId: privilege.privilegeId.toString(),
			}
		},

		async deletePrivilege({engine, authTables}, {privilegeId: privilegeIdString}: {
				privilegeId: string
			}) {
			const privilegeId = DamnId.fromString(privilegeIdString)
			const [privilege] = await engine.getPrivileges([privilegeId.toString()])

			if (!privilege)
				throw new ApiError(400, `cannot delete missing privilege "${privilege.privilegeId.toString()}"`)

			if (privilege.hard)
				throw new ApiError(400, `cannot delete hard privilege "${privilege.privilegeId.toString()}"`)

			await Promise.all([
				authTables.permissions
					.roleHasPrivilege.delete(find({privilegeId})),
				authTables.permissions
					.privilege.delete(find({privilegeId})),
			])
		},
	},
})
