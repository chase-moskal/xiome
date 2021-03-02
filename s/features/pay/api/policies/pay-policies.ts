
import {preparePayPolicyMaker} from "./utils/prepare-pay-policy-maker.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"

import {PayUserAuth} from "./types/contexts/pay-user-auth.js"
import {PayPolicyOptions} from "./types/pay-policy-options.js"
import {PayAppOwnerAuth} from "./types/contexts/pay-app-owner-auth.js"

export function payPolicies(options: PayPolicyOptions) {
	const payPolicy = preparePayPolicyMaker(options)
	const authPolicies = prepareAuthPolicies({
		config: options.config,
		tables: options.tables,
		verifyToken: options.verifyToken,
	})

	const user = payPolicy()<PayUserAuth>(authPolicies.user)
	const appOwner = payPolicy()<PayAppOwnerAuth>(authPolicies.appOwner)

	return {user, appOwner}
}
