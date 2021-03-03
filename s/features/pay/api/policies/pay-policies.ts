
import {preparePayPolicyMaker} from "./utils/prepare-pay-policy-maker.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"

import {PayUserAuth} from "./types/contexts/pay-user-auth.js"
import {PayPolicyOptions} from "./types/pay-policy-options.js"
import {PayAppOwnerAuth} from "./types/contexts/pay-app-owner-auth.js"
import {UserMeta} from "../../../auth/policies/types/user-meta.js"
import {UserAuth} from "../../../auth/policies/types/user-auth.js"
import {AppOwnerMeta} from "../../../auth/policies/types/app-owner-meta.js"
import {AppOwnerAuth} from "../../../auth/policies/types/app-owner-auth.js"

export function payPolicies(options: PayPolicyOptions) {
	const {preparePayPolicy, bakeBillingTables} = preparePayPolicyMaker(options)
	const authPolicies = prepareAuthPolicies({
		config: options.config,
		tables: options.tables,
		verifyToken: options.verifyToken,
	})

	const user = preparePayPolicy<
			UserMeta,
			UserAuth,
			PayUserAuth
		>(authPolicies.user)

	const appOwner = preparePayPolicy<
			AppOwnerMeta,
			AppOwnerAuth,
			PayAppOwnerAuth
		>(authPolicies.appOwner, async(meta, auth, request) => {
			return {
				...auth,
				globalTables: options.tables,
				async getTablesNamespacedForApp(appId: string) {
					return {
						...await auth.getTablesNamespacedForApp(appId),
						billing: await bakeBillingTables(appId),
					}
				},
			}
		})

	return {user, appOwner}
}
