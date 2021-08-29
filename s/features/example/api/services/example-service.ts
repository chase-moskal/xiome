
import {apiContext} from "renraku/x/api/api-context.js"

import {UserMeta} from "../../../auth/types/auth-metas.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
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
		return {
			...auth,
			exampleTables,
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
