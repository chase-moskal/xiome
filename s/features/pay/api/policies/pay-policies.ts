
import {PayPolicyOptions} from "./types/pay-policy-options.js"
import {PayUserAuth} from "./types/contexts/pay-user-auth.js"
import {UserMeta} from "../../../auth/policies/types/user-meta.js"
import {UserAuth} from "../../../auth/policies/types/user-auth.js"
import {PayAppOwnerAuth} from "./types/contexts/pay-app-owner-auth.js"
import {preparePayPolicyMaker} from "./utils/prepare-pay-policy-maker.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"

export function payPolicies(options: PayPolicyOptions) {
	const policy = preparePayPolicyMaker(options)
	const authPolicies = prepareAuthPolicies({
		config: options.config,
		tables: options.tables,
		verifyToken: options.verifyToken,
	})

	const user = policy<
			UserMeta,
			UserAuth,
			PayUserAuth
		>(authPolicies.user)

	const appOwner = policy<
			UserMeta,
			UserAuth,
			PayAppOwnerAuth
		>(authPolicies.appOwner)

	return {user, appOwner}
}
