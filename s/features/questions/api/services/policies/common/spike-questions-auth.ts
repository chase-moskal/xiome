

import {Policy} from "renraku/x/types/primitives/policy.js"
import {HttpRequest} from "renraku/x/types/http/http-request.js"

import {AnonAuth} from "../../../../../auth/policies/types/anon-auth.js"
import {AnonMeta} from "../../../../../auth/policies/types/anon-meta.js"
import {QuestionsTables} from "../../../tables/types/questions-tables.js"
import {prepareNamespacerForTables} from "../../../../../auth/tables/baking/generic/prepare-namespacer-for-tables.js"

export async function spikeQuestionsAuth<
		xMeta extends AnonMeta,
		xAuth extends AnonAuth
	>(
		meta: xMeta,
		request: HttpRequest,
		questionsTables: QuestionsTables,
		basePolicy: Policy<xMeta, xAuth>,
	) {

	const auth = await basePolicy.processAuth(meta, request)
	return {
		...auth,
		questionsTables: await prepareNamespacerForTables(questionsTables)(auth.access.appId),
	}
}
