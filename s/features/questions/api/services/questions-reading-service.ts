
import * as renraku from "renraku"

import {AnonMeta} from "../../../auth/types/auth-metas.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {resolveQuestions} from "./helpers/resolve-questions.js"
import {QuestionsApiOptions} from "../types/questions-api-options.js"
import {anonQuestionsPolicy} from "./policies/anon-questions-policy.js"
import {fetchUsers} from "../../../auth/aspects/users/routines/user/fetch-users.js"
import {appPermissions} from "../../../../assembly/backend/permissions/standard-permissions.js"
import {makePermissionsEngine} from "../../../../assembly/backend/permissions/permissions-engine.js"

export const makeQuestionsReadingService = (
	options: QuestionsApiOptions
) => renraku.service()

.policy(async(meta: AnonMeta, request) => {
	const auth = await anonQuestionsPolicy(options)(meta, request)
	auth.checker.requirePrivilege("read questions")
	return auth
})

.expose(({access, authTables, questionsTables}) => ({

	async fetchQuestions({board}: {board: string}) {
		const posts = await questionsTables.questionPosts.read({
			...find({board, archive: false}),
			limit: 100,
			offset: 0,
			order: {timePosted: "descend"},
		})

		if (!posts.length)
			return {users: [], questions: []}

		const resolvedQuestions = await resolveQuestions({
			questionsTables,
			questionPosts: posts,
			userId: access?.user?.userId
				? DamnId.fromString(access.user.userId)
				: undefined,
		})

		const userIds = (() => {
			const ids: string[] = []
			const rememberUserId = (userId: string) => {
				if (!ids.includes(userId))
					ids.push(userId)
			}
			for (const question of resolvedQuestions) {
				rememberUserId(question.authorUserId)
				for (const answer of question.answers)
					rememberUserId(answer.authorUserId)
			}
			return ids
		})()

		const permissionsEngine = makePermissionsEngine({
			permissionsTables: authTables.permissions,
			isPlatform: access.appId === options.config.platform.appDetails.appId,
		})

		const bannedUserIds = (await permissionsEngine.getPrivilegesForUsers(userIds))
			.filter(p => p.privileges.includes(appPermissions.privileges["banned"]))
			.map(p => p.userId)

		const users =
			(await fetchUsers({
				authTables,
				permissionsEngine,
				userIds: userIds.map(id => DamnId.fromString(id)),
			}))
				.filter(u => !bannedUserIds.includes(u.userId))

		const questions = resolvedQuestions
			.filter(q => !bannedUserIds.includes(q.authorUserId.toString()))
			.map(q => ({
				...q,
				answers: q.answers.filter(a => !bannedUserIds.includes(a.authorUserId))
			}))

		return {users, questions}
	},
}))
