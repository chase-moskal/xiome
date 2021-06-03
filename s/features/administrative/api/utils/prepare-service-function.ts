
import {apiContext} from "renraku/x/api/api-context.js"
import {Topic} from "renraku/x/types/primitives/topic.js"

import {UserAuth} from "../../../auth/policies/types/user-auth.js"
import {UserMeta} from "../../../auth/policies/types/user-meta.js"
import {AdministrativeApiOptions} from "../types/administrative-api-options.js"

export function prepareServiceFunction(options: AdministrativeApiOptions) {
	return function service<xAuth extends UserAuth,>({policy}: {
			policy: (auth: UserAuth) => Promise<xAuth>
		}) {

		return function<xTopic extends Topic<xAuth>>(expose: xTopic) {
			return apiContext<UserMeta, xAuth>()({
				expose,
				policy: {
					processAuth: async(meta, request) => {
						const auth = await options.authPolicies.user
							.processAuth(meta, request)
						return policy(auth)
					},
				},
			})
		}
	}
}
