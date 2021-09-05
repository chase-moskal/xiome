
import {User} from "../../../../../../auth/aspects/users/types/user.js"
import {Likeable, Reportable} from "../../../../../api/types/questions-and-answers.js"
import {ValueChangeEvent} from "../../../../../../xio-components/inputs/events/value-change-event.js"

export enum PostType {
	Question,
	Answer,
	Editor,
}

export interface UniversalPostOptions {
	type: PostType
	author: User
	content: string
	timePosted: number
}

export interface IdentifiablePost {
	postId: string
}

export interface Liking extends Likeable {
	castLikeVote?: (status: boolean) => void
}

export interface Reporting extends Reportable {
	castReportVote?: (status: boolean) => void
}

export interface VotablePost {
	liking: Liking
	reporting: Reporting
}

export interface DeletablePost {
	deletePost: undefined | (() => void)
}

export interface QuestionPost extends UniversalPostOptions, IdentifiablePost, VotablePost, DeletablePost {
	type: PostType.Question
	toggleAnswerEditor: undefined | (() => void)
}

export interface AnswerPost extends UniversalPostOptions, IdentifiablePost, VotablePost, DeletablePost {
	type: PostType.Answer
}

export interface PostEditor extends UniversalPostOptions {
	type: PostType.Editor
	isPostable: boolean
	postButtonText: string
	submitPost: () => void
	changeDraftContent: (event: ValueChangeEvent<string>) => void
}

export type AnyPost = QuestionPost | AnswerPost | PostEditor
