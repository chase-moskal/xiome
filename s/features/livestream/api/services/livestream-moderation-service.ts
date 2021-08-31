
import {apiContext} from "renraku/x/api/api-context.js"

import {UserMeta} from "../../../auth/types/auth-metas.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {LivestreamAuth} from "../types/livestream-auths.js"
import {LivestreamApiOptions} from "../types/livestream-api-options.js"
import {runValidation} from "../../../../toolbox/topic-validation/run-validation.js"
import {branch, maxLength, minLength, one, schema, string} from "../../../../toolbox/darkvalley.js"

export const makeLivestreamModerationService = ({
		authPolicies,
		livestreamTables,
	}: LivestreamApiOptions) => apiContext<UserMeta, LivestreamAuth>()({

	policy: async(meta, request) => {
		const auth = await authPolicies.userPolicy(meta, request)
		auth.checker.requirePrivilege("moderate livestream")
		return {...auth, livestreamTables}
	},

	expose: {

		async setShow({livestreamTables}, inputs: {
				label: string
				vimeoId: undefined | null | string
			}) {
			const {label, vimeoId} = runValidation(inputs, schema({
				label: one<string>(string(), maxLength(64), minLength(1)),
				vimeoId: branch(
					one<string>(string(), minLength(1), maxLength(2048)),
				),
			}))
			await livestreamTables.shows.assert({
				...find({label}),
				make: async() => ({label, vimeoId}),
			})
		}
	},
})
