
import {ApiError} from "renraku/x/api/api-error.js"

import {validateId} from "./validation/validate-id.js"
import {escapeRegex} from "../../../../toolbox/escape-regex.js"
import {find, or} from "../../../../toolbox/dbby/dbby-helpers.js"
import {UserAuth} from "../../../auth/policies/types/user-auth.js"
import {UserMeta} from "../../../auth/policies/types/user-meta.js"
import {validateTimeframe} from "./validation/validate-timeframe.js"
import {fetchUsers} from "../../../auth/topics/login/user/fetch-users.js"
import {schema, validator, boolean} from "../../../../toolbox/darkvalley.js"
import {asServiceParts} from "../../../../framework/api/as-service-parts.js"
import {AdministrativeApiOptions} from "../types/administrative-api-options.js"
import {validateUserSearchTerm} from "./validation/validate-user-search-term.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
import {fetchPermissionsDisplay} from "../../../auth/topics/permissions/fetch-permissions-display.js"
import {makePermissionsEngine} from "../../../../assembly/backend/permissions2/permissions-engine.js"

export const roleAssignmentParts = ({
		config,
		authPolicies,
	}: AdministrativeApiOptions) => asServiceParts<UserMeta, UserAuth>()({

	policy: async(meta, request) => {
		const auth = await authPolicies.user.processAuth(meta, request)
		auth.checker.requirePrivilege("administrate user roles")
		return auth
	},

	expose: {

		async fetchPermissions({tables, access}) {
			return fetchPermissionsDisplay({
				config,
				access,
				permissionsTables: tables.permissions,
			})
		},

		async searchUsers({tables, access}, options: {term: string}) {
			const {term} = runValidation(options, schema({
				term: validateUserSearchTerm,
			}))

			const regex = new RegExp(escapeRegex(term), "i")

			const profiles = await tables.user.profile.read({
				limit: 100,
				conditions: or(
					{equal: {userId: term}},
					{search: {nickname: regex}},
					{search: {tagline: regex}},
				),
			})

			const userIds = profiles.map(profile => profile.userId)
			if (!userIds.length)
				return []

			const permissionsEngine = makePermissionsEngine({
				isPlatform: access.appId === config.platform.appDetails.appId,
				permissionsTables: tables.permissions,
			})

			const users = await fetchUsers({
				userIds,
				permissionsEngine,
				authTables: tables,
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
					.map(role => role.roleId)
			}))
		},

		async assignRoleToUser(
				{tables},
				options: {
					roleId: string
					userId: string
					isPublic: boolean
					timeframeEnd: undefined | number
					timeframeStart: undefined | number
				},
			) {

			const {roleId, userId, isPublic, timeframeEnd, timeframeStart} = (
				runValidation(options, schema({
					roleId: validateId,
					userId: validateId,
					isPublic: validator(boolean()),
					timeframeEnd: validateTimeframe,
					timeframeStart: validateTimeframe,
				}))
			)

			const existing = await tables.permissions.userHasRole.one(find({
				userId,
				roleId,
			}))

			if (existing?.hard)
				throw new ApiError(400, "hard role assignment cannot be overwritten")
			else
				await tables.permissions.userHasRole.assert({
					conditions: or({equal: {roleId, userId}}),
					make: async() => ({
						hard: false,
						public: isPublic,
						roleId,
						userId,
						timeframeEnd,
						timeframeStart,
					}),
				})
		},

		async revokeRoleFromUser(
				{tables},
				options: {
					roleId: string
					userId: string
				},
			) {

			const {roleId, userId} = runValidation(options, schema({
				roleId: validateId,
				userId: validateId,
			}))

			const existing = await tables.permissions.userHasRole.one(find({
				userId,
				roleId,
			}))

			if (existing?.hard)
				throw new ApiError(400, "hard role assignment cannot be overwritten")
			else
				await tables.permissions.userHasRole.delete({
					conditions: or({equal: {roleId, userId}}),
				})
		},
	},
})
