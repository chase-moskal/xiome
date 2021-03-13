
import {Policy} from "renraku/x/types/primitives/policy.js"
import {payTablesBakery} from "./bakery/pay-tables-bakery.js"
import {CustomerAuth} from "./types/contexts/customer-auth.js"
import {CustomerMeta} from "./types/contexts/customer-meta.js"
import {MerchantAuth} from "./types/contexts/merchant-auth.js"
import {MerchantMeta} from "./types/contexts/merchant-meta.js"
import {PayPolicyOptions} from "./types/pay-policy-options.js"
import {ShopkeeperMeta} from "./types/contexts/shopkeeper-meta.js"
import {ShopkeeperAuth} from "./types/contexts/shopkeeper-auth.js"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"
import {ApiError} from "renraku/x/api/api-error"

export function payPolicies(options: PayPolicyOptions) {
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

	const customer: Policy<CustomerMeta, CustomerAuth> = {
		async processAuth(meta, request) {
			const auth = await authPolicies.user.processAuth(meta, request)
			const {tables, stripeLiaison} = await commonAuthProcessing(auth.app.appId)
			return {...auth, tables, stripeLiaison}
		}
	}

	const shopkeeper: Policy<ShopkeeperMeta, ShopkeeperAuth> = {
		async processAuth(meta, request) {
			const auth = await customer.processAuth(meta, request)
			if (!auth.access.permit.privileges.includes())
				throw new ApiError(403, "must have shopkeeper privilege")
			return auth
		}
	}

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

	return {customer, merchant}
}
