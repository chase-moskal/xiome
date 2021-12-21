
import * as renraku from "renraku"

import {UserMeta} from "../../../auth/types/auth-metas.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {ExampleApiOptions} from "../types/example-api-options.js"

export const makeExampleService = ({
	rando,
	config,
	authPolicies,
	exampleTables,
}: ExampleApiOptions) => renraku.service()

.policy(async(meta: UserMeta, headers) => {
	const auth = await authPolicies.userPolicy(meta, headers)
	const appId = DamnId.fromString(auth.access.appId)
	return {
		...auth,
		exampleTables: exampleTables.namespaceForApp(appId),
	}
})

.expose(({access, exampleTables}) => ({

	async exampleFunction({something}: {something: string}) {
		await exampleTables.examplePosts.create({
			exampleId: rando.randomId(),
			something,
		})
	},
}))
