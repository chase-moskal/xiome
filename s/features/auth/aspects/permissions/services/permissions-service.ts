
import * as renraku from "renraku"
import {Id, find} from "dbmage"

import {AuthOptions} from "../../../types/auth-options.js"
import {PrivilegeRow} from "../types/permissions-tables.js"
import {PermissionsMeta} from "../types/permissions-auth-and-metas.js"
import {PrivilegeDisplay} from "../../users/routines/permissions/types/privilege-display.js"
import {roleLabelValidator} from "../../users/routines/permissions/validators/role-label-validator.js"
import {makePermissionsEngine} from "../../../../../assembly/backend/permissions/permissions-engine.js"

export const makePermissionsService = ({
	rando, config, authPolicies,
}: AuthOptions) => renraku.service()

.policy(async(meta: PermissionsMeta, headers) => {
	const auth = await authPolicies.userPolicy(meta, headers)
	auth.checker.requirePrivilege("customize permissions")
	const engine = makePermissionsEngine({
		permissionsTables: auth.database.tables.auth.permissions,
		isPlatform: auth.access.appId === config.platform.appDetails.appId,
	})
	return {...auth, engine}
})

.expose(({database, engine}) => ({

	async fetchPermissions() {
		return engine.getPermissionsDisplay()
	},

	async createRole({label}: {label: string}) {
		const problems = roleLabelValidator(label)
		if (problems.length) throw new renraku.ApiError(
			400,
			`validation error on label: ${problems.join("; ")}`
		)
		await database.tables.auth.permissions.role.create({
			label,
			hard: false,
			public: true,
			assignable: true,
			roleId: rando.randomId(),
			time: Date.now(),
		})
	},

	async deleteRole({roleId: roleIdString}: {roleId: string}) {
		const roleId = Id.fromString(roleIdString)
		const role = await database.tables.auth.permissions.role
			.readOne(find({roleId}))

		if (!role)
			throw new renraku.ApiError(404, "role not found")

		if (role.hard)
			throw new renraku.ApiError(400, "cannot delete hard role")

		await Promise.all([
			database.tables.auth.permissions.userHasRole.delete(find({roleId})),
			database.tables.auth.permissions.role.delete(find({roleId})),
		])
	},

	async assignPrivilege({roleId: roleIdString, privilegeId: privilegeIdString}: {
			roleId: string
			privilegeId: string
		}) {
		const roleId = Id.fromString(roleIdString)
		const privilegeId = Id.fromString(privilegeIdString)
		await database.tables.auth.permissions.roleHasPrivilege.update({
			...find({roleId, privilegeId}),
			upsert: {
				roleId,
				privilegeId,
				active: true,
				immutable: false,
				time: Date.now(),
			},
		})
	},

	async unassignPrivilege({roleId: roleIdString, privilegeId: privilegeIdString}: {
			roleId: string
			privilegeId: string
		}) {
		const roleId = Id.fromString(roleIdString)
		const privilegeId = Id.fromString(privilegeIdString)
		await database.tables.auth.permissions.roleHasPrivilege.update({
			...find({roleId, privilegeId}),
			upsert: {
				roleId,
				privilegeId,
				active: false,
				immutable: false,
				time: Date.now(),
			},
		})
	},

	async createPrivilege({label}: {label: string}): Promise<PrivilegeDisplay> {
		const privilege: PrivilegeRow = {
			label,
			hard: false,
			privilegeId: rando.randomId(),
			time: Date.now(),
		}
		await database.tables.auth.permissions.privilege.create(privilege)
		return {
			hard: privilege.hard,
			label: privilege.label,
			privilegeId: privilege.privilegeId.toString(),
			time: Date.now(),
		}
	},

	async deletePrivilege({privilegeId: privilegeIdString}: {
			privilegeId: string
		}) {
		const privilegeId = Id.fromString(privilegeIdString)
		const [privilege] = await engine.getPrivileges([privilegeId.toString()])

		if (!privilege)
			throw new renraku.ApiError(400, `cannot delete missing privilege "${privilege.privilegeId.toString()}"`)

		if (privilege.hard)
			throw new renraku.ApiError(400, `cannot delete hard privilege "${privilege.privilegeId.toString()}"`)

		await Promise.all([
			database.tables.auth.permissions
				.roleHasPrivilege.delete(find({privilegeId})),
			database.tables.auth.permissions
				.privilege.delete(find({privilegeId})),
		])
	},
}))
