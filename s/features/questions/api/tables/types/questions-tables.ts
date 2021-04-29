
import {DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"

export type QuestionsTables = {
	questionPosts: DbbyTable<QuestionPostRow>
	questionLikes: DbbyTable<QuestionLikeRow>
	questionReports: DbbyTable<QuestionReportRow>
}

export type QuestionPostRow = {
	questionId: string
	authorUserId: string
	board: string
	content: string
	archive: boolean
	timePosted: number
}

export type QuestionLikeRow = {
	userId: string
	questionId: string
}

export type QuestionReportRow = {
	userId: string
	questionId: string
}
