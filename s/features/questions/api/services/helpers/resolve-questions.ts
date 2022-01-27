
import * as dbmage from "dbmage"
import {Id, findAll} from "dbmage"

import {makeVotingBooth} from "./voting-booth.js"
import {Question} from "../../types/questions-and-answers.js"
import {QuestionPostRow, QuestionsSchema} from "../../types/questions-schema.js"

export async function resolveQuestions({userId, questionPosts, questionsTables}: {
		userId?: Id
		questionPosts: QuestionPostRow[]
		questionsTables: dbmage.SchemaToTables<QuestionsSchema>
	}) {

	const questionIds = questionPosts.map(post => post.questionId)

	const answerPosts = questionIds.length
		? await questionsTables.answerPosts
			.read(findAll(questionIds, questionId => ({questionId, archive: false})))
		: []

	const answerIds = answerPosts.map(post => post.answerId)

	const boothDetails = {
		userId,
		likesTable: questionsTables.likes,
		reportsTable: questionsTables.reports,
	}

	const questionsVotingBooth = await makeVotingBooth({
		...boothDetails,
		itemIds: questionIds,
	})

	const answersVotingBooth = await makeVotingBooth({
		...boothDetails,
		itemIds: answerIds,
	})

	return questionIds.map(questionId => {
		const questionPost = questionPosts.find(post => post.questionId === questionId)

		const question: Question = {
			archive: questionPost.archive,
			authorUserId: questionPost.authorUserId.toString(),
			questionId: questionPost.questionId.toString(),
			board: questionPost.board,
			content: questionPost.content,
			timePosted: questionPost.timePosted,

			...questionsVotingBooth.getVotingDetails(questionId),

			answers: answerPosts
				.filter(answer => answer.questionId.toString() === questionId.toString())
				.map(answerPost => ({
					answerId: answerPost.answerId.toString(),
					questionId: answerPost.questionId.toString(),
					authorUserId: answerPost.authorUserId.toString(),
					content: answerPost.content,
					archive: answerPost.archive,
					timePosted: answerPost.timePosted,

					...answersVotingBooth.getVotingDetails(answerPost.answerId),
				})),
		}

		return question
	})
}
