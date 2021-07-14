
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"

export type QuestionsTables = {
	questionPosts: DbbyTable<QuestionPostRow>
	questionLikes: DbbyTable<QuestionLikeRow>
	questionReports: DbbyTable<QuestionReportRow>
}

export type QuestionPostRow = {
	questionId: DamnId
	authorUserId: DamnId
	board: string
	content: string
	archive: boolean
	timePosted: number
}

export type QuestionLikeRow = {
	userId: DamnId
	questionId: DamnId
}

export type QuestionReportRow = {
	userId: DamnId
	questionId: DamnId
}
