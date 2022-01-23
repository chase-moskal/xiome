
import {UserAuth} from "../../../auth/types/auth-metas.js"
import {QuestionsSchema} from "../tables/types/questions-tables.js"

export interface QuestionsUserAuth extends UserAuth {
	questionsTables: QuestionsSchema
}

export interface QuestionsAnonAuth extends UserAuth {
	questionsTables: QuestionsSchema
}
