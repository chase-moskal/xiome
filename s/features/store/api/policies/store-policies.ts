
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

	async function bakePayTables(id_app: string): Promise<StoreTables> {
		return {
			billing: await prepareNamespacerForTables(tables.billing)(id_app),
			merchant: await prepareNamespacerForTables(tables.merchant)(id_app),
		}
	}

	async function commonAuthProcessing(authTables: AuthTables, id_app: string) {
		const tables = {...authTables, ...await bakePayTables(id_app)}
		return {tables}
	}

	/** a merchant owns apps, and links stripe accounts */
	const merchant: Policy<MerchantMeta, MerchantAuth> = {
		async processAuth(meta, request) {
			const auth = await authPolicies.appOwner.processAuth(meta, request)
			const {stripeLiaisonForPlatform} = stripeComplex
			return {
				...auth,
				...await commonAuthProcessing(auth.tables, auth.access.id_app),
				stripeLiaisonForPlatform,
				async getTablesNamespacedForApp(id_app: string) {
					const authTables = await auth.getTablesNamespacedForApp(id_app)
					const payTables = await bakePayTables(id_app)
					return {...authTables, ...payTables}
				},
			}
		}
	}

	/** a prospect user is checking if ecommerce is available */
	const prospect: Policy<ProspectMeta, ProspectAuth> = {
		async processAuth(meta, request) {
			const auth = await authPolicies.anon.processAuth(meta, request)
			const common = await commonAuthProcessing(auth.tables, auth.access.id_app)
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
			const common = await commonAuthProcessing(auth.tables, auth.access.id_app)
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
