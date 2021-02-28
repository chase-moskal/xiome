
import {ApiError} from "renraku/x/api/api-error.js"
import {Policy} from "renraku/x/types/primitives/policy.js"
import {PayUserMeta} from "./types/contexts/pay-user-meta.js"
import {PayUserAuth} from "./types/contexts/pay-user-auth.js"
import {PayPolicyOptions} from "./types/pay-policy-options.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"
import {prepareNamespacerForTables} from "../../../auth/tables/baking/generic/prepare-namespacer-for-tables.js"

export function payPolicies(options: PayPolicyOptions) {

	const authPolicies = prepareAuthPolicies({
		config: options.config,
		authTables: options.tables,
		verifyToken: options.verifyToken,
	})

	const bakeBillingTables = prepareNamespacerForTables(options.tables.billing)

	const user: Policy<PayUserMeta, PayUserAuth> = {
		processAuth: async(meta, request) => {
			const auth = await authPolicies.user.processAuth(meta, request)
			const {appId} = auth.app
			const tables = {
				...auth.tables,
				billing: await bakeBillingTables(appId),
			}
			const stripeLiaison = await options.makeStripeLiaison({tables})
			return {...auth, tables, stripeLiaison}
		},
	}

	const platformUser: Policy<PayUserMeta, PayUserAuth> = {
		processAuth: async(meta, request) => {
			const auth = await user.processAuth(meta, request)
			if (!auth.app.platform)
				throw new ApiError(403, "forbidden: only platform users allowed here")
			return auth
		}
	}

	return {user, platformUser}
}
