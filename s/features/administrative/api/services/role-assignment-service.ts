
import * as renraku from "renraku"
import {Id, find, or, assert} from "dbmage"

import {escapeRegex} from "../../../../toolbox/escape-regex.js"
import {schema, boolean} from "../../../../toolbox/darkvalley.js"
import {validateTimeframe} from "./validation/validate-timeframe.js"
import {validateId} from "../../../../common/validators/validate-id.js"
import {AdministrativeOptions} from "../types/administrative-options.js"
import {validateUserSearchTerm} from "./validation/validate-user-search-term.js"
import {fetchUsers} from "../../../auth/aspects/users/routines/user/fetch-users.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
import {makePermissionsEngine} from "../../../../assembly/backend/permissions/permissions-engine.js"
import {PermissionsMeta} from "../../../auth/aspects/permissions/types/permissions-auth-and-metas.js"

export const makeRoleAssignmentService = ({
	config,
	authPolicies,
}: AdministrativeOptions) => renraku.service()

.policy(async(meta: PermissionsMeta, headers) => {
	const auth = await authPolicies.userPolicy(meta, headers)
	auth.checker.requirePrivilege("administrate user roles")
	const engine = makePermissionsEngine({
		permissionsTables: auth.database.tables.auth.permissions,
		isPlatform: auth.access.appId === config.platform.appDetails.appId,
	})
	return {...auth, engine}
})

.expose(({engine, database}) => ({

	async fetchPermissions() {
		return engine.getPermissionsDisplay()
	},

	async searchUsers(options: {term: string}) {
		const {term} = runValidation(options, schema({
			term: validateUserSearchTerm,
		}))

		const regex = new RegExp(escapeRegex(term), "i")

		const profiles = await database.tables.auth.users.profiles.read({
			limit: 100,
			conditions: Id.isId(term)
				? or({equal: {userId: Id.fromString(term)}})
				: or(
					{search: {nickname: regex}},
					{search: {tagline: regex}},
				)
		})

		const userIds = profiles.map(profile => profile.userId)
		if (!userIds.length)
			return []

		const users = await fetchUsers({
			userIds,
			permissionsEngine: engine,
			authTables: database.tables.auth,
		})

		const usersAndRoles = await engine.getUsersHaveRoles({
			userIds: users.map(user => user.userId),
			onlyGetPublicRoles: false,
		})

		return users.map(user => ({
			user,
			roleIds: usersAndRoles
				.find(u => u.userId === user.userId)
				.userHasRoles
				.map(role => role.roleId.toString())
		}))
	},

	async assignRoleToUser(options: {
			roleId: string
			userId: string
			isPublic: boolean
			timeframeEnd: undefined | number
			timeframeStart: undefined | number
		}) {

		const {roleId: roleIdString, userId: userIdString, isPublic, timeframeEnd, timeframeStart} = (
			runValidation(options, schema({
				roleId: validateId,
				userId: validateId,
				isPublic: boolean(),
				timeframeEnd: validateTimeframe,
				timeframeStart: validateTimeframe,
			}))
		)

		const roleId = Id.fromString(roleIdString)
		const userId = Id.fromString(userIdString)

		const existing = await database.tables.auth.permissions.userHasRole.readOne(find({
			userId,
			roleId,
		}))

		if (existing?.hard)
			throw new renraku.ApiError(400, "hard role assignment cannot be overwritten")
		else
			await assert(
				database.tables.auth.permissions.userHasRole,
				find({roleId, userId}),
				async() => ({
					hard: false,
					public: isPublic,
					roleId,
					userId,
					timeframeEnd,
					timeframeStart,
					time: Date.now(),
				})
			)
	},

	async revokeRoleFromUser(options: {
			roleId: string
			userId: string
		}) {

		const {roleId: roleIdString, userId: userIdString} =
			runValidation(options, schema({
				roleId: validateId,
				userId: validateId,
			}))

		const roleId = Id.fromString(roleIdString)
		const userId = Id.fromString(userIdString)

		const existing = await database.tables.auth.permissions.userHasRole.readOne(find({
			userId,
			roleId,
		}))

		if (existing?.hard)
			throw new renraku.ApiError(400, "hard role assignment cannot be overwritten")
		else
			await database.tables.auth.permissions.userHasRole.delete({
				conditions: or({equal: {roleId, userId}}),
			})
	},
}))
