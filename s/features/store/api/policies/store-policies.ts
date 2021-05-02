
import {Policy} from "renraku/x/types/primitives/policy.js"
import {StorePolicyOptions} from "./types/store-policy-options.js"
import {MerchantAuth} from "./types/contexts/merchant-auth.js"
import {MerchantMeta} from "./types/contexts/merchant-meta.js"
import {CustomerAuth} from "./types/contexts/customer-auth.js"
import {CustomerMeta} from "./types/contexts/customer-meta.js"
import {ClerkMeta} from "./types/contexts/clerk-meta.js"
import {ClerkAuth} from "./types/contexts/clerk-auth.js"
import {ProspectMeta} from "./types/contexts/prosect-meta.js"
import {ProspectAuth} from "./types/contexts/prosect-auth.js"
import {StoreTables} from "../tables/types/store-tables.js"
import {prepareNamespacerForTables} from "../../../auth/tables/baking/generic/prepare-namespacer-for-tables.js"
import {AuthTables} from "../../../auth/tables/types/auth-tables.js"

export function payPolicies({
		tables,
		authPolicies,
		stripeComplex,
	}: StorePolicyOptions) {

	async function bakePayTables(appId: string): Promise<StoreTables> {
		return {
			billing: await prepareNamespacerForTables(tables.billing)(appId),
			merchant: await prepareNamespacerForTables(tables.merchant)(appId),
		}
	}

	async function commonAuthProcessing(authTables: AuthTables, appId: string) {
		const tables = {...authTables, ...await bakePayTables(appId)}
		return {tables}
	}

	/** a merchant owns apps, and links stripe accounts */
	const merchant: Policy<MerchantMeta, MerchantAuth> = {
		async processAuth(meta, request) {
			const auth = await authPolicies.appOwner.processAuth(meta, request)
			const {stripeLiaisonForPlatform} = stripeComplex
			return {
				...auth,
				...await commonAuthProcessing(auth.tables, auth.access.appId),
				stripeLiaisonForPlatform,
				async getTablesNamespacedForApp(appId: string) {
					const authTables = await auth.getTablesNamespacedForApp(appId)
					const payTables = await bakePayTables(appId)
					return {...authTables, ...payTables}
				},
			}
		}
	}

	/** a prospect user is checking if ecommerce is available */
	const prospect: Policy<ProspectMeta, ProspectAuth> = {
		async processAuth(meta, request) {
			const auth = await authPolicies.anon.processAuth(meta, request)
			const common = await commonAuthProcessing(auth.tables, auth.access.appId)
			const {stripeLiaisonForPlatform} = stripeComplex
			async function getStripeAccount(id: string) {
				return stripeLiaisonForPlatform.accounts.retrieve(id)
			}
			return {...auth, ...common, getStripeAccount}
		}
	}

	/** a customer is a user who buys things */
	const customer: Policy<CustomerMeta, CustomerAuth> = {
		async processAuth(meta, request) {
			const auth = await authPolicies.user.processAuth(meta, request)
			const common = await commonAuthProcessing(auth.tables, auth.access.appId)
			const {stripeAccountId} = await common.tables.merchant
				.stripeAccounts
				.one({conditions: false})
			const stripeLiaisonForApp = stripeComplex
				.connectStripeLiaisonForApp(stripeAccountId)
			return {
				...auth,
				...common,
				stripeLiaisonForApp,
			}
		}
	}

	/** a clerk edits products and subscriptions */
	const clerk: Policy<ClerkMeta, ClerkAuth> = {
		async processAuth(meta, request) {
			const auth = await customer.processAuth(meta, request)
			auth.checker.requirePrivilege("manage store")
			return auth
		}
	}

	return {merchant, prospect, customer, clerk}
}
