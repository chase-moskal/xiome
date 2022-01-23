
import * as renraku from "renraku"
import * as dbproxy from "../../../../toolbox/dbproxy/dbproxy.js"

import {UserMeta} from "../../../auth/types/auth-metas.js"
import {ExampleApiOptions} from "../types/example-api-options.js"
import {UnconstrainedTable} from "../../../../framework/api/unconstrained-table.js"

export const makeExampleService = ({
	rando,
	authPolicies,
	database: rawDatabase,
}: ExampleApiOptions) => renraku.service()

.policy(async(meta: UserMeta, headers) => {
	const auth = await authPolicies.userPolicy(meta, headers)
	const appId = dbproxy.Id.fromString(auth.access.appId)
	const database = UnconstrainedTable.constrainDatabaseForApp({
		appId,
		database: rawDatabase,
	})
	return {
		...auth,
		database,
	}
})

.expose(({database}) => ({
	async exampleFunction({something}: {something: string}) {
		await database.tables.examplePosts.create({
			exampleId: rando.randomId2(),
			something,
		})
	},
}))
