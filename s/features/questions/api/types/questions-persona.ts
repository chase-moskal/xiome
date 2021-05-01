
import {AnonAuth} from "../../../auth/policies/types/anon-auth.js"
import {AnonMeta} from "../../../auth/policies/types/anon-meta.js"
import {UserAuth} from "../../../auth/policies/types/user-auth.js"
import {UserMeta} from "../../../auth/policies/types/user-meta.js"
import {QuestionsTables} from "../tables/types/questions-tables.js"

type QuestionsAuth = {
	questionsTables: QuestionsTables
}

export type QuestionReaderMeta = AnonMeta
export type QuestionReaderAuth = QuestionsAuth & AnonAuth

export type QuestionPosterMeta = UserMeta
export type QuestionPosterAuth = QuestionsAuth & UserAuth

export type QuestionModeratorMeta = QuestionPosterMeta
export type QuestionModeratorAuth = QuestionPosterAuth
