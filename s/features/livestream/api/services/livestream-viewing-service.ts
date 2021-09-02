
import {apiContext} from "renraku/x/api/api-context.js"

import {UserMeta} from "../../../auth/types/auth-metas.js"
import {LivestreamAuth} from "../types/livestream-auths.js"
import {find, findAll} from "../../../../toolbox/dbby/dbby-helpers.js"
import {LivestreamApiOptions} from "../types/livestream-api-options.js"
import {validateShowLabel} from "../validation/livestream-validators.js"
import {array, each, one, schema} from "../../../../toolbox/darkvalley.js"
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

		async getShows({livestreamTables}, inputs: {
				labels: string[]
			}) {
			const {labels} = runValidation(inputs, schema({
				labels: one<string[]>(
					each(validateShowLabel)
				),
			}))
			const shows = await livestreamTables.shows.read(
				findAll(labels, label => ({label}))
			)
			return labels.map(label => {
				return shows.find(show => show.label === label)
					?? {label, vimeoId: null}
			})
		}
	},
})
