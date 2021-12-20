
import {RenrakuHttpHeaders} from "renraku"

import {AnonMeta} from "../../../../auth/types/auth-metas.js"
import {spikeQuestionsAuth} from "./common/spike-questions-auth.js"
import {QuestionsApiOptions} from "../../types/questions-api-options.js"

export function anonQuestionsPolicy({
		authPolicies,
		questionsTables,
	}: QuestionsApiOptions) {

	return async function(meta: AnonMeta, headers: RenrakuHttpHeaders) {
		return spikeQuestionsAuth(meta, headers, questionsTables, authPolicies.anonPolicy)
	}
}
