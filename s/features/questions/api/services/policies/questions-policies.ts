
import * as renraku from "renraku"
import * as dbmage from "dbmage"

import {AnonMeta, UserMeta} from "../../../../auth/types/auth-metas.js"
import {QuestionsApiOptions} from "../../types/questions-api-options.js"
import {QuestionsAnonAuth, QuestionsUserAuth} from "../../types/questions-metas-and-auths.js"

export function anonQuestionsPolicy({
		authPolicies,
	}: QuestionsApiOptions): renraku.Policy<AnonMeta, QuestionsAnonAuth> {

	return async(meta: AnonMeta, headers: renraku.HttpHeaders) => {
		const auth = await authPolicies.anonPolicy(meta, headers)
		return {
			...auth,
			database: dbmage.subsection(auth.database, tables => ({
				auth: tables.auth,
				questions: tables.questions
			})),
		}
	}
}

export function authenticatedQuestionsPolicy({
		authPolicies,
	}: QuestionsApiOptions): renraku.Policy<UserMeta, QuestionsUserAuth> {

	return async(meta: UserMeta, headers: renraku.HttpHeaders) => {
		const auth = await authPolicies.userPolicy(meta, headers)
		return {
			...auth,
			database: dbmage.subsection(auth.database, tables => ({
				auth: tables.auth,
				questions: tables.questions
			})),
		}
	}
}
