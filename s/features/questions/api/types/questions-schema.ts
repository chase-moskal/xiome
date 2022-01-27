
import {AuthSchema} from "../../../auth/types/auth-schema.js"
import * as dbmage from "dbmage"

export type QuestionsDatabase = dbmage.Database<{
	auth: AuthSchema
	questions: QuestionsSchema
}>

export type QuestionsSchema = dbmage.AsSchema<{
	questionPosts: QuestionPostRow
	answerPosts: AnswerPostRow
	likes: SimpleVoteRow
	reports: SimpleVoteRow
}>

export type SimpleVoteTable = dbmage.Table<SimpleVoteRow>

export type CommonContentItem = dbmage.AsRow<{
	questionId: dbmage.Id
	authorUserId: dbmage.Id
	board: string
	content: string
	archive: boolean
	timePosted: number
}>

export type QuestionPostRow = CommonContentItem

export type AnswerPostRow = dbmage.AsRow<{
	answerId: dbmage.Id
}> & CommonContentItem

export type SimpleVoteRow = dbmage.AsRow<{
	userId: dbmage.Id
	itemId: dbmage.Id
}>
