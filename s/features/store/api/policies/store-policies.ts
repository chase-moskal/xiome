
import {Policy} from "renraku/x/types/primitives/policy.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {StorePolicyOptions} from "./types/store-policy-options.js"
import {ClerkAuth, ClerkMeta, CustomerAuth, CustomerMeta, MerchantAuth, MerchantMeta, ProspectAuth, ProspectMeta} from "./types/store-metas-and-auths.js"

export function prepareStorePolicies({
		authPolicies,
		stripeComplex,
		storeTables: unconstrainedStoreTables,
	}: StorePolicyOptions) {

	/** a merchant owns apps, and links stripe accounts */
	const merchantPolicy: Policy<MerchantMeta, MerchantAuth> = async(meta, request) => {
		const auth = await authPolicies.appOwnerPolicy(meta, request)
		const {stripeLiaisonForPlatform} = stripeComplex
		async function authorizeMerchantForApp(appId: DamnId) {
			const {authTables} = await auth.authorizeAppOwner(appId)
			return {
				authTables,
				storeTables: unconstrainedStoreTables.namespaceForApp(appId),
			}
		}
		return {
			...auth,
			authorizeMerchantForApp,
			stripeLiaisonForPlatform,
		}
	}

	/** a prospect user is checking if ecommerce is available */
	const prospectPolicy: Policy<ProspectMeta, ProspectAuth> = async(meta, request) => {
		const auth = await authPolicies.anonPolicy(meta, request)
		const appId = DamnId.fromString(auth.access.appId)
		const {stripeLiaisonForPlatform} = stripeComplex
		async function getStripeAccount(id: string) {
			return stripeLiaisonForPlatform.accounts.retrieve(id)
		}
		return {
			...auth,
			storeTables: unconstrainedStoreTables.namespaceForApp(appId),
			getStripeAccount,
		}
	}

	/** a customer is a user who buys things */
	const customerPolicy: Policy<CustomerMeta, CustomerAuth> = async(meta, request) => {
		const auth = await authPolicies.userPolicy(meta, request)
		const appId = DamnId.fromString(auth.access.appId)
		const storeTables = unconstrainedStoreTables.namespaceForApp(appId)

		const {stripeAccountId} = await storeTables.merchant.stripeAccounts
			.one({conditions: false})

		const stripeLiaisonForApp = stripeComplex
			.connectStripeLiaisonForApp(stripeAccountId)

		return {
			...auth,
			storeTables,
			stripeLiaisonForApp,
		}
	}

	/** a clerk edits products and subscriptions */
	const clerkPolicy: Policy<ClerkMeta, ClerkAuth> = async(meta, request) => {
		const auth = await customerPolicy(meta, request)
		auth.checker.requirePrivilege("manage store")
		return auth
	}

	return {merchantPolicy, prospectPolicy, customerPolicy, clerkPolicy}
}
