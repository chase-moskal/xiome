
import {anonQuestionsPolicy} from "./anon-questions-policy.js"
import {HttpRequest} from "renraku/x/types/http/http-request.js"

import {UserMeta} from "../../../../auth/policies/types/user-meta.js"
import {QuestionsApiOptions} from "../../types/questions-api-options.js"

export function authenticatedQuestionsPolicy(options: QuestionsApiOptions) {
	return async function(meta: UserMeta, request: HttpRequest) {
		return anonQuestionsPolicy(options)(meta, request)
	}
}
