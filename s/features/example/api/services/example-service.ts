
import * as renraku from "renraku"
import * as dbproxy from "../../../../toolbox/dbproxy/dbproxy.js"

import {UserMeta} from "../../../auth/types/auth-metas.js"
import {ExampleApiOptions} from "../types/example-api-options.js"

export const makeExampleService = ({
	rando,
	authPolicies,
}: ExampleApiOptions) => renraku.service()

.policy(async(meta: UserMeta, headers) => {
	const auth = await authPolicies.userPolicy(meta, headers)
	return {
		...auth,
		database: dbproxy.subsection(auth.database, tables => tables.example),
	}
})

.expose(({database}) => ({
	async exampleFunction({something}: {something: string}) {
		await database.tables.examplePosts.create({
			exampleId: rando.randomId(),
			something,
		})
	},
}))
