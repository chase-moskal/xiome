
import * as renraku from "renraku"
import * as dbmage from "dbmage"

import {AnonAuth, AnonMeta} from "../../../../../auth/types/auth-metas.js"
import {DatabaseSelect} from "../../../../../../assembly/backend/types/database.js"
import {UnconstrainedTable} from "../../../../../../framework/api/unconstrained-table.js"

export async function spikeQuestionsAuth<
		xMeta extends AnonMeta,
		xAuth extends AnonAuth
	>(
		meta: xMeta,
		headers: renraku.HttpHeaders,
		questionsDatabase: DatabaseSelect<"questions">,
		basePolicy: renraku.Policy<xMeta, xAuth>,
	) {

	const auth = await basePolicy(meta, headers)
	const appId = dbmage.Id.fromString(auth.access.appId)
	return {
		...auth,
		questionsDatabase: UnconstrainedTable
			.constrainDatabaseForApp({database: questionsDatabase, appId}),
	}
}
