
import {or} from "../../../../toolbox/dbby/dbby-helpers.js"
import {UserAuth} from "../../../auth/policies/types/user-auth.js"
import {MakeServiceOptions} from "../types/make-service-options.js"
import {fetchUsers} from "../../../auth/topics/login/user/fetch-users.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
import {maxLength, minLength, one, schema, string, validator} from "../../../../toolbox/darkvalley.js"
import {makePermissionsEngine} from "../../../../assembly/backend/permissions2/permissions-engine.js"

export const searchUsersService = ({
		config, service,
	}: MakeServiceOptions) => service<UserAuth>({
		policy: async auth => {
			auth.checker.requirePrivilege("search users")
			return auth
		},
	})({

	async searchForUsers(
			{tables, access},
			options: {term: string},
		) {

		const {term} = runValidation(options, schema({
			term: validator<string>(one(
				string(),
				minLength(2),
				maxLength(48),
			)),
		}))

		const profiles = await tables.user.profile.read({
			limit: 25,
			conditions: or(
				{search: {userId: term}},
				{search: {nickname: term}},
			),
		})

		const userIds = profiles.map(profile => profile.userId)

		const permissionsEngine = makePermissionsEngine({
			isPlatform: access.appId === config.platform.appDetails.appId,
			permissionsTables: tables.permissions,
		})

		return await fetchUsers({
			userIds,
			permissionsEngine,
			authTables: tables,
		})
	},
})
