
import {Policy} from "renraku/x/types/primitives/policy.js"
import {payTablesBakery} from "./bakery/store-tables-bakery.js"
import {StorePolicyOptions} from "./types/store-policy-options.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"
import {MerchantAuth} from "./types/contexts/merchant-auth.js"
import {MerchantMeta} from "./types/contexts/merchant-meta.js"
import {CustomerAuth} from "./types/contexts/customer-auth.js"
import {CustomerMeta} from "./types/contexts/customer-meta.js"
import {ClerkMeta} from "./types/contexts/clerk-meta.js"
import {ClerkAuth} from "./types/contexts/clerk-auth.js"

export function payPolicies(options: StorePolicyOptions) {
	const authPolicies = prepareAuthPolicies({
		config: options.config,
		tables: options.tables,
		verifyToken: options.verifyToken,
	})
	const bakePayTables = payTablesBakery(options)
	async function commonAuthProcessing(appId: string) {
		const tables = {...options.tables, ...await bakePayTables(appId)}
		return {tables}
	}

	/** a merchant owns apps, and links stripe accounts */
	const merchant: Policy<MerchantMeta, MerchantAuth> = {
		async processAuth(meta, request) {
			const auth = await authPolicies.appOwner.processAuth(meta, request)
			const {tables} = await commonAuthProcessing(auth.app.appId)
			const stripeAccounting = options.stripeComplex.accounting
			async function getTablesNamespacedForApp(appId: string) {
				const authTables = await auth.getTablesNamespacedForApp(appId)
				const payTables = await bakePayTables(appId)
				return {...authTables, ...payTables}
			}
			return {...auth, tables, stripeAccounting, getTablesNamespacedForApp}
		}
	}

	/** a customer is a user who buys things */
	const customer: Policy<CustomerMeta, CustomerAuth> = {
		async processAuth(meta, request) {
			const auth = await authPolicies.user.processAuth(meta, request)
			const {tables} = await commonAuthProcessing(auth.app.appId)
			const {stripeAccountId} = await tables.merchant.stripeAccounts.one({
				conditions: false,
			})
			const stripeLiaison = options.stripeComplex.getLiaison({
				tables,
				stripeConnectAccountId: stripeAccountId,
			})
			return {...auth, tables, stripeLiaison}
		}
	}

	/** a clerk edits products and subscriptions */
	const clerk: Policy<ClerkMeta, ClerkAuth> = {
		async processAuth(meta, request) {
			const auth = await customer.processAuth(meta, request)
			auth.checker.requirePrivilege("manage products and subscription plans")

			return {...auth}
		}
	}

	return {merchant, customer, clerk}
}
