
import {ApiError} from "renraku/x/api/api-error.js"
import {Policy} from "renraku/x/types/primitives/policy.js"
import {payTablesBakery} from "./bakery/store-tables-bakery.js"
import {CustomerAuth} from "./types/contexts/customer-auth.js"
import {CustomerMeta} from "./types/contexts/customer-meta.js"
import {MerchantAuth} from "./types/contexts/merchant-auth.js"
import {MerchantMeta} from "./types/contexts/merchant-meta.js"
import {StorePolicyOptions} from "./types/store-policy-options.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"
import {appPermissions} from "../../../../assembly/backend/permissions/standard/app-permissions.js"
import {SubscriptionsManagerMeta} from "./types/contexts/subscriptions-manager-meta.js"
import {SubscriptionsManagerAuth} from "./types/contexts/subscriptions-manager-auth.js"

export function payPolicies(options: StorePolicyOptions) {
	const authPolicies = prepareAuthPolicies({
		config: options.config,
		tables: options.tables,
		verifyToken: options.verifyToken,
	})
	const bakePayTables = payTablesBakery(options)
	async function commonAuthProcessing(appId: string) {
		const tables = {...options.tables, ...await bakePayTables(appId)}
		const stripeLiaison = await options.makeStripeLiaison({tables})
		return {tables, stripeLiaison}
	}

	/**
	 * a merchant is the owner of an app, on the platform, who links their
	 * stripe account to receive payouts
	 */
	const merchant: Policy<MerchantMeta, MerchantAuth> = {
		async processAuth(meta, request) {
			const auth = await authPolicies.appOwner.processAuth(meta, request)
			const {tables, stripeLiaison} = await commonAuthProcessing(auth.app.appId)
			async function getTablesNamespacedForApp(appId: string) {
				const authTables = await auth.getTablesNamespacedForApp(appId)
				const payTables = await bakePayTables(appId)
				return {...authTables, ...payTables}
			}
			return {...auth, tables, stripeLiaison, getTablesNamespacedForApp}
		}
	}

	/**
	 * a customer is an app's end-user who might buy things
	 */
	const customer: Policy<CustomerMeta, CustomerAuth> = {
		async processAuth(meta, request) {
			const auth = await authPolicies.user.processAuth(meta, request)
			const {tables, stripeLiaison} = await commonAuthProcessing(auth.app.appId)
			return {...auth, tables, stripeLiaison}
		}
	}

	/**
	 * a store manager is an app user who can edit products and offerings
	 */
	const manager: Policy<SubscriptionsManagerMeta, SubscriptionsManagerAuth> = {
		async processAuth(meta, request) {
			const auth = await customer.processAuth(meta, request)

			if (!auth.access.permit.privileges.includes(
					appPermissions.privileges["edit products and subscription plans"]
				))
				throw new ApiError(403, "insufficient privileges")

			return auth
		}
	}

	return {merchant, customer, manager}
}
