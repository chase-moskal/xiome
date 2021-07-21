

import {Policy} from "renraku/x/types/primitives/policy.js"
import {HttpRequest} from "renraku/x/types/http/http-request.js"

import {DamnId} from "../../../../../../toolbox/damnedb/damn-id.js"
import {QuestionsTables} from "../../../tables/types/questions-tables.js"
import {AnonAuth, AnonMeta} from "../../../../../auth/types/auth-metas.js"
import {UnconstrainedTables} from "../../../../../../framework/api/types/table-namespacing-for-apps.js"

export async function spikeQuestionsAuth<
		xMeta extends AnonMeta,
		xAuth extends AnonAuth
	>(
		meta: xMeta,
		request: HttpRequest,
		questionsTables: UnconstrainedTables<QuestionsTables>,
		basePolicy: Policy<xMeta, xAuth>,
	) {

	const auth = await basePolicy(meta, request)
	const appId = DamnId.fromString(auth.access.appId)
	return {
		...auth,
		questionsTables: questionsTables.namespaceForApp(appId),
	}
}
