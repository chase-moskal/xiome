
import {apiContext} from "renraku/x/api/api-context.js"

import {UserMeta} from "../../../auth/types/auth-metas.js"
import {LivestreamAuth} from "../types/livestream-auths.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {LivestreamApiOptions} from "../types/livestream-api-options.js"
import {validateShowInput} from "../validation/livestream-validators.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"

export const makeLivestreamModerationService = ({
		authPolicies,
		livestreamTables,
	}: LivestreamApiOptions) => apiContext<UserMeta, LivestreamAuth>()({

	policy: async(meta, request) => {
		const auth = await authPolicies.userPolicy(meta, request)
		auth.checker.requirePrivilege("moderate livestream")
		const appId = DamnId.fromString(auth.access.appId)
		return {
			...auth,
			livestreamTables: livestreamTables.namespaceForApp(appId),
		}
	},

	expose: {

		async setShow({livestreamTables}, inputs: {
				label: string
				vimeoId: undefined | null | string
			}) {
			const {label, vimeoId} = runValidation(inputs, validateShowInput)
			await livestreamTables.shows.update({
				...find({label}),
				write: {label, vimeoId},
			})
		}
	},
})
