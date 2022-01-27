
import * as renraku from "renraku"

import {day} from "../../../../../toolbox/goodtimes/times.js"
import {Id, and} from "dbmage"
import {QuestionsDatabase} from "../../types/questions-schema.js"

const timeframe = 1 * day
const allowedNumberOfPostsInTimeframe = 10

export async function rateLimitQuestions({userId, database}: {
		userId: Id
		database: QuestionsDatabase
	}) {
	const count = await database.tables.questions.questionPosts.count({
		conditions: and(
			{equal: {authorUserId: userId, archive: false}},
			{greater: {timePosted: Date.now() - timeframe}},
		)
	})
	if (count > allowedNumberOfPostsInTimeframe)
		throw new renraku.ApiError(429, "too many posts")
}

export async function rateLimitAnswers({userId, questionId, database}: {
		userId: Id
		questionId: Id
		database: QuestionsDatabase
	}) {
	const count = await database.tables.questions.answerPosts.count({
		conditions: and(
			{equal: {authorUserId: userId, questionId, archive: false}},
			{greater: {timePosted: Date.now() - timeframe}},
		)
	})
	if (count > allowedNumberOfPostsInTimeframe)
		throw new renraku.ApiError(429, "too many posts")
}
