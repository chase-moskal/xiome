
import {apiContext} from "renraku/x/api/api-context.js"

import {UserMeta} from "../../../auth/types/auth-metas.js"
import {LivestreamAuth} from "../types/livestream-auths.js"
import {findAll} from "../../../../toolbox/dbby/dbby-helpers.js"
import {LivestreamApiOptions} from "../types/livestream-api-options.js"
import {validateShowLabel} from "../validation/livestream-validators.js"
import {each, validator, schema, minLength, maxLength, array} from "../../../../toolbox/darkvalley.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {LivestreamShow} from "../types/livestream-tables.js"

export const makeLivestreamViewingService = ({
		authPolicies,
		livestreamTables,
	}: LivestreamApiOptions) => apiContext<UserMeta, LivestreamAuth>()({

	policy: async(meta, request) => {
		const auth = await authPolicies.userPolicy(meta, request)
		auth.checker.requirePrivilege("view livestream")
		const appId = DamnId.fromString(auth.access.appId)
		return {
			...auth,
			livestreamTables: livestreamTables.namespaceForApp(appId),
		}
	},

	expose: {

		async getShows({livestreamTables}, inputs: {
				labels: string[]
			}): Promise<LivestreamShow[]> {

			if (inputs.labels.length === 0)
				return []

			const {labels} = runValidation(inputs, schema({
				labels: validator<string[]>(
					array(),
					minLength(1),
					maxLength(100),
					each(validateShowLabel)
				),
			}))

			const shows = await livestreamTables.shows.read(
				findAll(labels, label => ({label}))
			)

			return labels.map(label => {
				return shows.find(show => show.label === label)
					?? {label, vimeoId: ""}
			})
		}
	},
})
