
import {ApiError} from "renraku/x/api/api-error.js"
import {apiContext} from "renraku/x/api/api-context.js"

import {validateId} from "./validation/validate-id.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {escapeRegex} from "../../../../toolbox/escape-regex.js"
import {find, or} from "../../../../toolbox/dbby/dbby-helpers.js"
import {validateTimeframe} from "./validation/validate-timeframe.js"
import {UserAuth, UserMeta} from "../../../auth/types/auth-metas.js"
import {AdministrativeOptions} from "../types/administrative-options.js"
import {schema, boolean} from "../../../../toolbox/darkvalley.js"
import {validateUserSearchTerm} from "./validation/validate-user-search-term.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
import {fetchUsers} from "../../../auth/aspects/users/routines/user/fetch-users.js"
import {makePermissionsEngine} from "../../../../assembly/backend/permissions/permissions-engine.js"
import {PermissionsAuth, PermissionsMeta} from "../../../auth/aspects/permissions/types/permissions-auth-and-metas.js"

export const makeRoleAssignmentService = ({
		config,
		authPolicies,
	}: AdministrativeOptions) => apiContext<PermissionsMeta, PermissionsAuth>()({
	policy: async(meta, request) => {
		const auth = await authPolicies.userPolicy(meta, request)
		auth.checker.requirePrivilege("administrate user roles")
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

		async searchUsers({access, authTables}, options: {term: string}) {
			const {term} = runValidation(options, schema({
				term: validateUserSearchTerm,
			}))

			const regex = new RegExp(escapeRegex(term), "i")

			const profiles = await authTables.users.profiles.read({
				limit: 100,
				conditions: DamnId.isId(term)
					? or({equal: {userId: DamnId.fromString(term)}})
					: or(
						{search: {nickname: regex}},
						{search: {tagline: regex}},
					)
			})

			const userIds = profiles.map(profile => profile.userId)
			if (!userIds.length)
				return []

			const permissionsEngine = makePermissionsEngine({
				isPlatform: access.appId === config.platform.appDetails.appId,
				permissionsTables: authTables.permissions,
			})

			const users = await fetchUsers({
				userIds,
				authTables,
				permissionsEngine,
			})

			const usersAndRoles = await permissionsEngine.getUsersHaveRoles({
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

		async assignRoleToUser(
				{authTables},
				options: {
					roleId: string
					userId: string
					isPublic: boolean
					timeframeEnd: undefined | number
					timeframeStart: undefined | number
				},
			) {

			const {roleId: roleIdString, userId: userIdString, isPublic, timeframeEnd, timeframeStart} = (
				runValidation(options, schema({
					roleId: validateId,
					userId: validateId,
					isPublic: boolean(),
					timeframeEnd: validateTimeframe,
					timeframeStart: validateTimeframe,
				}))
			)

			const roleId = DamnId.fromString(roleIdString)
			const userId = DamnId.fromString(userIdString)

			const existing = await authTables.permissions.userHasRole.one(find({
				userId,
				roleId,
			}))

			if (existing?.hard)
				throw new ApiError(400, "hard role assignment cannot be overwritten")
			else
				await authTables.permissions.userHasRole.assert({
					conditions: or({equal: {roleId, userId}}),
					make: async() => ({
						hard: false,
						public: isPublic,
						roleId,
						userId,
						timeframeEnd,
						timeframeStart,
						time: Date.now(),
					}),
				})
		},

		async revokeRoleFromUser(
				{authTables},
				options: {
					roleId: string
					userId: string
				},
			) {

			const {roleId: roleIdString, userId: userIdString} =
				runValidation(options, schema({
					roleId: validateId,
					userId: validateId,
				}))

			const roleId = DamnId.fromString(roleIdString)
			const userId = DamnId.fromString(userIdString)

			const existing = await authTables.permissions.userHasRole.one(find({
				userId,
				roleId,
			}))

			if (existing?.hard)
				throw new ApiError(400, "hard role assignment cannot be overwritten")
			else
				await authTables.permissions.userHasRole.delete({
					conditions: or({equal: {roleId, userId}}),
				})
		},
	},
})
