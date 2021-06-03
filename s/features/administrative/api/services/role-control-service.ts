
import {ApiError} from "renraku/x/api/api-error.js"

import {find, or} from "../../../../toolbox/dbby/dbby-helpers.js"
import {UserAuth} from "../../../auth/policies/types/user-auth.js"
import {MakeServiceOptions} from "../types/make-service-options.js"
import {throwProblems} from "../../../../toolbox/topic-validation/throw-problems.js"
import {length, one, schema, string, validator, boolean, number, branch, notDefined, Validator} from "../../../../toolbox/darkvalley.js"

const validateId = validator(one(
	string(),
	length(48),
))

const validateTimeframe: Validator<undefined | number> = branch<undefined | number>(
	notDefined(),
	number(),
)

export const roleControlService = ({
		service,
	}: MakeServiceOptions) => service<UserAuth>({
		policy: async auth => {
			auth.checker.requirePrivilege("assign roles")
			return auth
		},
	})({

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

		throwProblems(schema({
			roleId: validateId,
			userId: validateId,
			isPublic: validator(boolean()),
			timeframeEnd: validateTimeframe,
			timeframeStart: validateTimeframe,
		})(options))

		const {roleId, userId, isPublic, timeframeEnd, timeframeStart} = options

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

		throwProblems(schema({
			roleId: validateId,
			userId: validateId,
		})(options))

		const {roleId, userId} = options

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
})
