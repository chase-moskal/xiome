
import * as renraku from "renraku"

import {UserMeta} from "../../../auth/types/auth-metas.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import * as dbproxy from "../../../../toolbox/dbproxy/dbproxy.js"
import {ExampleApiOptions} from "../types/example-api-options.js"
import {UnconstrainedTable} from "../../../../framework/api/unconstrained-table.js"
import {ConstrainMixedTables, ReconstrainTable} from "../../../../framework/api/types/unconstrained-tables.js"

export const makeExampleService = ({
	rando,
	authPolicies,
	database: rawDatabase,
}: ExampleApiOptions) => renraku.service()

.policy(async(meta: UserMeta, headers) => {
	const auth = await authPolicies.userPolicy(meta, headers)
	const appId = dbproxy.Id.fromString(auth.access.appId)
	const database = UnconstrainedTable.constrainDatabaseSubsectionForApp({
		appId,
		subsection: rawDatabase,
	})
	return {
		...auth,
		database,
	}
})

.expose(({access, database}) => ({
	async exampleFunction({something}: {something: string}) {
		await database.tables.examplePosts.create({
			exampleId: rando.randomId2(),
			something,
		})
	},
}))
