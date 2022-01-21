
import * as dbproxy from "../../../../../toolbox/dbproxy/dbproxy.js"

export type QuestionsTables = dbproxy.AsSchema<{
	questionPosts: QuestionPostRow
	answerPosts: AnswerPostRow
	likes: SimpleVoteRow
	reports: SimpleVoteRow
}>

export type CommonContentItem = {
	questionId: dbproxy.Id
	authorUserId: dbproxy.Id
	board: string
	content: string
	archive: boolean
	timePosted: number
}

export type QuestionPostRow = CommonContentItem

export type AnswerPostRow = {
	answerId: dbproxy.Id
} & CommonContentItem

export type SimpleVoteRow = {
	userId: dbproxy.Id
	itemId: dbproxy.Id
}
