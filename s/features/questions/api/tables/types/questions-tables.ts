
import {DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"

export type QuestionsTables = {
	questionPosts: DbbyTable<QuestionPostRow>
	questionLikes: DbbyTable<QuestionLikeRow>
	questionReports: DbbyTable<QuestionReportRow>
}

export type QuestionPostRow = {
	id_question: string
	authorUserId: string
	board: string
	content: string
	archive: boolean
	timePosted: number
}

export type QuestionLikeRow = {
	userId: string
	id_question: string
}

export type QuestionReportRow = {
	userId: string
	id_question: string
}
