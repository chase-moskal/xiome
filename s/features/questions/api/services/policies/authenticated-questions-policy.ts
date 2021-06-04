
import {HttpRequest} from "renraku/x/types/http/http-request.js"
import {spikeQuestionsAuth} from "./common/spike-questions-auth.js"
import {UserMeta} from "../../../../auth/policies/types/user-meta.js"
import {QuestionsApiOptions} from "../../types/questions-api-options.js"

export function authenticatedQuestionsPolicy({
		authPolicies,
		questionsTables,
	}: QuestionsApiOptions) {

	return async function(meta: UserMeta, request: HttpRequest) {
		return spikeQuestionsAuth(meta, request, questionsTables, authPolicies.user)
	}
}
