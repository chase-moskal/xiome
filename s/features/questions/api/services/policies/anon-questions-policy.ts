
import {HttpRequest} from "renraku/x/types/http/http-request.js"
import {spikeQuestionsAuth} from "./common/spike-questions-auth.js"
import {AnonMeta} from "../../../../auth/policies/types/anon-meta.js"
import {QuestionsApiOptions} from "../../types/questions-api-options.js"

export function anonQuestionsPolicy({
		authPolicies,
		questionsTables,
	}: QuestionsApiOptions) {

	return async function(meta: AnonMeta, request: HttpRequest) {
		return spikeQuestionsAuth(meta, request, questionsTables, authPolicies.anon)
	}
}
