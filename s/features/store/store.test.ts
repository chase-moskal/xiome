
import {Suite, expect} from "cynic"
import {ops} from "../../framework/ops.js"
import {storeTestSetup} from "./testing/store-test-setup.js"

export default <Suite>{
	async "shopkeeping"() {
		return {
			async "merchant can link a bank account"() {
				const {makeClient} = await storeTestSetup()
				const {storeModel, ...client} = await makeClient()
				expect(ops.value(storeModel.state.stripeAccountDetailsOp)).not.ok()
				await storeModel.bank.linkStripeAccount()
				expect(ops.value(storeModel.state.stripeAccountDetailsOp)).ok()
				await client.setLoggedOut()
				expect(ops.value(storeModel.state.stripeAccountDetailsOp)).not.ok()
			},
			async "merchant can flip store status online/offline"() {},
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
