
import {ApiError} from "renraku/x/api/api-error.js"
import {Policy} from "renraku/x/types/primitives/policy.js"
import {PayUserMeta} from "./types/contexts/pay-user-meta.js"
import {PayUserAuth} from "./types/contexts/pay-user-auth.js"
import {PayPolicyOptions} from "./types/pay-policy-options.js"
import {basePolicies} from "../../../auth/policies/base/base-policies.js"
import {prepareTableNamespacer} from "../../../auth/tables/baking/generic/prepare-table-namespacer.js"

export function payPolicies(options: PayPolicyOptions) {
	const base = basePolicies(options)
	const namespacePayTables = prepareTableNamespacer(options.rawPayTables)
	const namespacePermissionsTables = prepareTableNamespacer(options.rawPermissionsTables)

	const payUser: Policy<PayUserMeta, PayUserAuth> = {
		processAuth: async(meta, request) => {
			const auth = await base.baseUser.processAuth(meta, request)
			const {appId} = auth.app
			const payTables = namespacePayTables(appId)
			const permissionsTables = namespacePermissionsTables(appId)
			const stripeLiaison = await options.makeStripeLiaison({
				payTables,
				permissionsTables,
			})
			return {...auth, payTables, stripeLiaison}
		},
	}

	const payPlatformUser: Policy<PayUserMeta, PayUserAuth> = {
		processAuth: async(meta, request) => {
			const auth = await payUser.processAuth(meta, request)
			if (!auth.app.platform)
				throw new ApiError(403, "forbidden: only platform users allowed here")
			return auth
		}
	}

	return {payUser, payPlatformUser}
}
