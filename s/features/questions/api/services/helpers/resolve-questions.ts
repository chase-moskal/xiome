
import {Question} from "../../types/questions-and-answers.js"
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {findAll, or} from "../../../../../toolbox/dbby/dbby-helpers.js"
import {QuestionPostRow, QuestionsTables, SimpleVoteTable} from "../../tables/types/questions-tables.js"

export async function resolveQuestions({userId, questionPosts, questionsTables}: {
		userId: DamnId
		questionPosts: QuestionPostRow[]
		questionsTables: QuestionsTables
	}) {

	const questionIds = questionPosts.map(post => post.questionId)

	const answerPosts = questionIds.length
		? await questionsTables.answerPosts
			.read(findAll(questionIds, questionId => ({questionId})))
		: []

	const questionLikes = await makeVoteCounter({
		itemIds: questionIds,
		voteTable: questionsTables.likes,
	})

	const questionReports = await makeVoteCounter({
		itemIds: questionIds,
		voteTable: questionsTables.reports,
	})

	return questionIds.map(questionId => {
		const questionPost = questionPosts.find(post => post.questionId === questionId)
		const question: Question = {
			likes: questionLikes.countVotes(questionId),
			reports: questionReports.countVotes(questionId),
			liked: questionLikes.voteStatus(userId),
			reported: questionReports.voteStatus(userId),

			archive: questionPost.archive,
			authorUserId: questionPost.authorUserId.toString(),
			questionId: questionPost.questionId.toString(),
			board: questionPost.board,
			content: questionPost.content,
			timePosted: questionPost.timePosted,

			answers: [],
		}
		return question
	})
}

async function makeVoteCounter({itemIds, voteTable}: {
		itemIds: DamnId[]
		voteTable: SimpleVoteTable
	}) {
	const votes = itemIds.length
		? await voteTable.read(findAll(itemIds, itemId => ({itemId})))
		: []
	return {
		countVotes(itemId: DamnId) {
			return votes
				.filter(vote => vote.itemId.toString() === itemId.toString())
				.length
		},
		voteStatus(userId: DamnId) {
			return !!votes.find(vote => vote.userId.toString() === userId.toString())
		},
	}
}
