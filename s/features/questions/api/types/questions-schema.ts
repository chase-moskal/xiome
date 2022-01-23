
import {AuthSchema} from "../../../auth/types/auth-schema.js"
import * as dbproxy from "../../../../toolbox/dbproxy/dbproxy.js"

export type QuestionsDatabase = dbproxy.Database<{
	auth: AuthSchema
	questions: QuestionsSchema
}>

export type QuestionsSchema = dbproxy.AsSchema<{
	questionPosts: QuestionPostRow
	answerPosts: AnswerPostRow
	likes: SimpleVoteRow
	reports: SimpleVoteRow
}>

export type SimpleVoteTable = dbproxy.Table<SimpleVoteRow>

export type CommonContentItem = dbproxy.AsRow<{
	questionId: dbproxy.Id
	authorUserId: dbproxy.Id
	board: string
	content: string
	archive: boolean
	timePosted: number
}>

export type QuestionPostRow = CommonContentItem

export type AnswerPostRow = dbproxy.AsRow<{
	answerId: dbproxy.Id
}> & CommonContentItem

export type SimpleVoteRow = dbproxy.AsRow<{
	userId: dbproxy.Id
	itemId: dbproxy.Id
}>
