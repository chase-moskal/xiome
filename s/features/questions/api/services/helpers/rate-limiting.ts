
import * as renraku from "renraku"

import {day} from "../../../../../toolbox/goodtimes/times.js"
import {and} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {QuestionsSchema} from "../../types/questions-schema.js"

const timeframe = 1 * day
const allowedNumberOfPostsInTimeframe = 10

export async function rateLimitQuestions({userId, questionsTables}: {
		userId: DamnId
		questionsTables: QuestionsSchema
	}) {
	const count = await questionsTables.questionPosts.count({
		conditions: and(
			{equal: {authorUserId: userId, archive: false}},
			{greater: {timePosted: Date.now() - timeframe}},
		)
	})
	if (count > allowedNumberOfPostsInTimeframe)
		throw new renraku.ApiError(429, "too many posts")
}

export async function rateLimitAnswers({userId, questionId, questionsTables}: {
		userId: DamnId
		questionId: DamnId
		questionsTables: QuestionsSchema
	}) {
	const count = await questionsTables.answerPosts.count({
		conditions: and(
			{equal: {authorUserId: userId, questionId, archive: false}},
			{greater: {timePosted: Date.now() - timeframe}},
		)
	})
	if (count > allowedNumberOfPostsInTimeframe)
		throw new renraku.ApiError(429, "too many posts")
}
