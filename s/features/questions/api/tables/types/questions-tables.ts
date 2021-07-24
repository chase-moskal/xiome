
import {DamnId} from "../../../../../toolbox/damnedb/damn-id.js"
import {DbbyTable} from "../../../../../toolbox/dbby/dbby-types.js"

export type QuestionsTables = {
	questionPosts: DbbyTable<QuestionPostRow>
	answerPosts: DbbyTable<AnswerPostRow>
	likes: DbbyTable<SimpleVoteRow>
	reports: DbbyTable<SimpleVoteRow>
}

export type CommonContentItem = {
	questionId: DamnId
	authorUserId: DamnId
	board: string
	content: string
	archive: boolean
	timePosted: number
}

export type QuestionPostRow = CommonContentItem

export type AnswerPostRow = {
	answerId: DamnId
} & CommonContentItem

export type SimpleVoteRow = {
	userId: DamnId
	itemId: DamnId
}
