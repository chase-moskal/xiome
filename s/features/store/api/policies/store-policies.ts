
import {Policy} from "renraku/x/types/primitives/policy.js"
import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {ClerkAuth, ClerkMeta, CustomerAuth, CustomerMeta, MerchantAuth, MerchantMeta, ProspectAuth, ProspectMeta} from "./types/store-metas-and-auths.js"
import {UnconstrainedTables} from "../../../../framework/api/types/table-namespacing-for-apps.js"
import {StoreTables} from "../tables/types/store-tables.js"
import {makeStripeLiaison} from "../../stripe2/liaison/stripe-liaison.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"

export function prepareStorePolicies({
		authPolicies,
		stripeLiaison,
		storeTables: unconstrainedStoreTables,
	}: {
		storeTables: UnconstrainedTables<StoreTables>
		stripeLiaison: ReturnType<typeof makeStripeLiaison>
		authPolicies: ReturnType<typeof prepareAuthPolicies>
	}) {

	/** a merchant owns apps, and links stripe accounts */
	const merchantPolicy: Policy<MerchantMeta, MerchantAuth> = async(meta, request) => {
		const auth = await authPolicies.userPolicy(meta, request)
		const {appId} = auth.access
		return {
			...auth,
			stripeLiaison,
			storeTables: unconstrainedStoreTables.namespaceForApp(
				DamnId.fromString(appId)
			),
		}
	}

	/** a prospect user is checking if ecommerce is available */
	const prospectPolicy: Policy<ProspectMeta, ProspectAuth> = async(meta, request) => {
		const auth = await authPolicies.anonPolicy(meta, request)
		const appId = DamnId.fromString(auth.access.appId)
		async function getStripeAccount(id: string) {
			return stripeLiaison.accounts.retrieve(id)
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

		const stripeLiaisonAccount = stripeLiaison.account(stripeAccountId)

		return {
			...auth,
			storeTables,
			stripeLiaisonAccount,
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
