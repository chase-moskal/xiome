
import * as renraku from "renraku"

import {UserMeta} from "../../../../auth/types/auth-metas.js"
import {spikeQuestionsAuth} from "./common/spike-questions-auth.js"
import {QuestionsApiOptions} from "../../types/questions-api-options.js"

export function authenticatedQuestionsPolicy({
		authPolicies,
		questionsTables,
	}: QuestionsApiOptions) {

	return async function(meta: UserMeta, headers: renraku.HttpHeaders) {
		return spikeQuestionsAuth(meta, headers, questionsTables, authPolicies.userPolicy)
	}
}
