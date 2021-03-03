
import {Policy} from "renraku/x/types/primitives/policy"
import {prepareAuthPolicies} from "../../../auth/policies/prepare-auth-policies.js"
import {UserAuth} from "../../../auth/policies/types/user-auth.js"
import {AuthTables} from "../../../auth/tables/types/auth-tables.js"
import {PayTables} from "../tables/types/pay-tables.js"
import {payTablesBakery} from "./bakery/pay-tables-bakery.js"
import {CustomerAuth} from "./types/contexts/customer-auth.js"
import {CustomerMeta} from "./types/contexts/customer-meta.js"
import {MerchantAuth} from "./types/contexts/merchant-auth.js"
import {MerchantMeta} from "./types/contexts/merchant-meta.js"
import {PayPolicyOptions} from "./types/pay-policy-options.js"

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
