
import {RenrakuHttpHeaders, RenrakuPolicy} from "renraku"

import {DamnId} from "../../../../../../toolbox/damnedb/damn-id.js"
import {QuestionsTables} from "../../../tables/types/questions-tables.js"
import {AnonAuth, AnonMeta} from "../../../../../auth/types/auth-metas.js"
import {UnconstrainedTables} from "../../../../../../framework/api/types/table-namespacing-for-apps.js"

export async function spikeQuestionsAuth<
		xMeta extends AnonMeta,
		xAuth extends AnonAuth
	>(
		meta: xMeta,
		headers: RenrakuHttpHeaders,
		questionsTables: UnconstrainedTables<QuestionsTables>,
		basePolicy: RenrakuPolicy<xMeta, xAuth>,
	) {

	const auth = await basePolicy(meta, headers)
	const appId = DamnId.fromString(auth.access.appId)
	return {
		...auth,
		questionsTables: questionsTables.namespaceForApp(appId),
	}
}
