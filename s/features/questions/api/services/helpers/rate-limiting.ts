
import {ApiError} from "renraku/x/api/api-error.js"

import {day} from "../../../../../toolbox/goodtimes/times.js"
import {and} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {QuestionsTables} from "../../tables/types/questions-tables.js"

const timeframe = 1 * day
const allowedNumberOfPostsInTimeframe = 5

export async function rateLimitQuestions({userId, questionsTables}: {
		userId: DamnId
		questionsTables: QuestionsTables
	}) {
	const count = await questionsTables.questionPosts.count({
		conditions: and(
			{equal: {authorUserId: userId, archive: false}},
			{greater: {timePosted: Date.now() - timeframe}},
		)
	})
	if (count > allowedNumberOfPostsInTimeframe)
		throw new ApiError(429, "too many posts")
}

export async function rateLimitAnswers({userId, questionId, questionsTables}: {
		userId: DamnId
		questionId: DamnId
		questionsTables: QuestionsTables
	}) {
	const count = await questionsTables.answerPosts.count({
		conditions: and(
			{equal: {authorUserId: userId, questionId, archive: false}},
			{greater: {timePosted: Date.now() - timeframe}},
		)
	})
	if (count > allowedNumberOfPostsInTimeframe)
		throw new ApiError(429, "too many posts")
}
