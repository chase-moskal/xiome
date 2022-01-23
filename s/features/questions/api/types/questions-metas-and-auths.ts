
import {QuestionsDatabase} from "./questions-schema.js"
import {AnonAuth, UserAuth} from "../../../auth/types/auth-metas.js"

export interface QuestionsAnonAuth extends Omit<AnonAuth, "database"> {
	database: QuestionsDatabase
}

export interface QuestionsUserAuth extends Omit<UserAuth, "database"> {
	database: QuestionsDatabase
}
