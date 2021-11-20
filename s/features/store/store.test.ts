
import {Suite, expect} from "cynic"
import {ops} from "../../framework/ops.js"
import {simpleStoreSetup} from "./testing/store-quick-setups.js"

export default <Suite>{
	async "shopkeeping"() {
		return {
			"stripe bank account linking": {
				async "merchant can link a bank account"() {
					const {storeModel, ...client} = await simpleStoreSetup("control store bank link")
					expect(ops.value(storeModel.state.stripeAccountDetailsOp)).not.ok()
					await storeModel.bank.linkStripeAccount()
					expect(ops.value(storeModel.state.stripeAccountDetailsOp)).ok()
					await client.setLoggedOut()
					expect(ops.value(storeModel.state.stripeAccountDetailsOp)).not.ok()
				},
				async "rejected without the right privilege"() {
					const {storeModel} = await simpleStoreSetup()
					expect(ops.value(storeModel.state.stripeAccountDetailsOp)).not.ok()
					await expect(async() => storeModel.bank.linkStripeAccount()).throws()
				},
			},
			async "store status online/offline"() {},
		}
	},
	async "subscriptions"() {
		return {
			"planning": {
				async "merchant can create a subscription plan"() {},
				async "merchant can deactivate/activate subscription plans"() {},
			},
			"sales": {
				async "customer can purchase a subscription"() {},
				async "customer can cancel a subscription"() {},
				async "customer can update subscription's payment method"() {},
				async "subscription ends if automatic renewal fails"() {},
			},
			"bookkeeping": {
				async "customer can view a subscription's details"() {},
				async "customer can view payment history"() {},
			},
		}
	},
	async "digital products"() {
		return {
			async "merchant can manage digital product listings"() {},
			async "customer can purchase a digital product"() {},
			async "customer can obtain product ownership tokens"() {},
		}
	},
}
