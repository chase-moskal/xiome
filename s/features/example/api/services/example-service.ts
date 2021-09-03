
import {apiContext} from "renraku/x/api/api-context.js"

import {UserMeta} from "../../../auth/types/auth-metas.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {ExampleApiOptions} from "../types/example-api-options.js"
import {ExampleUserAuth} from "../types/example-metas-and-auth.js"

export const makeExampleService = ({
		rando,
		config,
		authPolicies,
		exampleTables,
	}: ExampleApiOptions) => apiContext<UserMeta, ExampleUserAuth>()({

	policy: async(meta, request) => {
		const auth = await authPolicies.userPolicy(meta, request)
		const appId = DamnId.fromString(auth.access.appId)
		return {
			...auth,
			exampleTables: exampleTables.namespaceForApp(appId),
		}
	},

	expose: {

		async exampleFunction(
				{access, exampleTables},
				{something}: {something: string},
			) {
			
			await exampleTables.examplePosts.create({
				exampleId: rando.randomId(),
				something,
			})
		}
	},
})
