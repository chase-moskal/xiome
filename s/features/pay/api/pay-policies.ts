
import {Policy} from "renraku/x/types/primitives/policy.js"
import {basePolicies} from "../../auth/policies/base/base-policies.js"
import {PayUserMeta} from "../types/policies/contexts/pay-user-meta.js"
import {PayUserAuth} from "../types/policies/contexts/pay-user-auth.js"
import {PayPolicyOptions} from "../types/policies/pay-policy-options.js"

export function payPolicies(options: PayPolicyOptions) {
	const {baseUser} = basePolicies(options)

	const payUser: Policy<PayUserMeta, PayUserAuth> = {
		processAuth: async(meta, request) => {
			const baseAuth = await baseUser.processAuth(meta, request)
			const tables = options.bakePayTables(baseAuth.app.appId)
			return {...baseAuth, tables}
		},
	}

	return {payUser}
}
