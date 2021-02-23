
import {Policy} from "renraku/x/types/primitives/policy.js"
import {payTableBakery} from "./bakery/pay-table-bakery.js"
import {PayUserMeta} from "./types/contexts/pay-user-meta.js"
import {PayUserAuth} from "./types/contexts/pay-user-auth.js"
import {PayPolicyOptions} from "./types/pay-policy-options.js"
import {basePolicies} from "../../../auth/policies/base/base-policies.js"

export function payPolicies(options: PayPolicyOptions) {
	const {baseUser} = basePolicies(options)
	const bakePayTables = payTableBakery({rawPayTables: options.rawPayTables})

	const payUser: Policy<PayUserMeta, PayUserAuth> = {
		processAuth: async(meta, request) => {
			const baseAuth = await baseUser.processAuth(meta, request)
			const tables = bakePayTables(baseAuth.app.appId)
			return {...baseAuth, tables}
		},
	}

	return {payUser}
}
