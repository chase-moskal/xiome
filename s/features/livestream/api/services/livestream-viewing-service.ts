
import {apiContext} from "renraku/x/api/api-context.js"

import {schema} from "../../../../toolbox/darkvalley.js"
import {UserMeta} from "../../../auth/types/auth-metas.js"
import {LivestreamAuth} from "../types/livestream-auths.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {LivestreamApiOptions} from "../types/livestream-api-options.js"
import {validateShowLabel} from "../validation/livestream-validators.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"

export const makeLivestreamViewingService = ({
		authPolicies,
		livestreamTables,
	}: LivestreamApiOptions) => apiContext<UserMeta, LivestreamAuth>()({

	policy: async(meta, request) => {
		const auth = await authPolicies.userPolicy(meta, request)
		auth.checker.requirePrivilege("view livestream")
		return {...auth, livestreamTables}
	},

	expose: {

		async getShow({livestreamTables}, inputs: {label: string}) {
			const {label} = runValidation(inputs, schema({
				label: validateShowLabel,
			}))
			const show = await livestreamTables.shows.one(
				find({label})
			)
			return {
				label: show.label,
				vimeoId: show.vimeoId,
			}
		}
	},
})
