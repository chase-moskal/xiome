
import {HttpRequest} from "renraku/x/types/http/http-request.js"
import {spikeQuestionsAuth} from "./common/spike-questions-auth.js"
import {QuestionsApiOptions} from "../../types/questions-api-options.js"
import {AnonMeta} from "../../../../auth2/types/auth-metas.js"

export function anonQuestionsPolicy({
		authPolicies,
		questionsTables,
	}: QuestionsApiOptions) {

	return async function(meta: AnonMeta, request: HttpRequest) {
		return spikeQuestionsAuth(meta, request, questionsTables, authPolicies.anonPolicy)
	}
}
