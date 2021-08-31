
import {apiContext} from "renraku/x/api/api-context.js"

import {UserMeta} from "../../../auth/types/auth-metas.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {LivestreamApiOptions} from "../types/livestream-api-options.js"
import {LivestreamUserAuth} from "../types/livestream-auths.js"

export const makeLivestreamViewingService = ({
		rando,
		config,
		authPolicies,
		livestreamTables: exampleTables,
	}: LivestreamApiOptions) => apiContext<UserMeta, LivestreamUserAuth>()({

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
