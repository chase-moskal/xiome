
import {asTopic} from "renraku/x/identities/as-topic.js"
import {or} from "../../../toolbox/dbby/dbby-helpers.js"
import {throwProblems} from "../../../toolbox/topic-validation/throw-problems.js"
import {makePermissionsEngine} from "../../../assembly/backend/permissions2/permissions-engine.js"

import {fetchUsers} from "./login/user/fetch-users.js"
import {UserAuth} from "../policies/types/user-auth.js"
import {AuthApiOptions} from "../types/auth-api-options.js"
import {maxLength, minLength, one, string, validator} from "../../../toolbox/darkvalley.js"

const validateTerm = validator(one(
	string(),
	minLength(2),
	maxLength(48),
))

export const searchUsersTopic = ({
		config
	}: AuthApiOptions) => asTopic<UserAuth>()({

	async searchForUsers(
			{tables, access},
			{term}: {term: string},
		) {

		throwProblems(validateTerm(term))

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
