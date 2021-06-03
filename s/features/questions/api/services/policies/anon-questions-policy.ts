
import {HttpRequest} from "renraku/x/types/http/http-request.js"
import {AnonMeta} from "../../../../auth/policies/types/anon-meta.js"
import {QuestionsApiOptions} from "../../types/questions-api-options.js"
import {prepareNamespacerForTables} from "../../../../auth/tables/baking/generic/prepare-namespacer-for-tables.js"

export function anonQuestionsPolicy({
		authPolicies,
		questionsTables,
	}: QuestionsApiOptions) {

	return async function(meta: AnonMeta, request: HttpRequest) {
		const auth = await authPolicies.anon.processAuth(meta, request)
		return {
			...auth,
			questionsTables: await prepareNamespacerForTables(questionsTables)(auth.access.appId),
		}
	}
}
