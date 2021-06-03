
import {ApiError} from "renraku/x/api/api-error.js"

import {validateId} from "../utils/validation/validate-id.js"
import {find, or} from "../../../../toolbox/dbby/dbby-helpers.js"
import {UserAuth} from "../../../auth/policies/types/user-auth.js"
import {validateTimeframe} from "../utils/validation/validate-timeframe.js"
import {schema, validator, boolean} from "../../../../toolbox/darkvalley.js"
import {MakeAdminisrativeService} from "../types/make-adminisrative-service.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"

export const roleAssignmentService:
	MakeAdminisrativeService<UserAuth> = () => ({

	policy: async auth => {
		auth.checker.requirePrivilege("assign roles")
		return auth
	},

	expose: {

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
