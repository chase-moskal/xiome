
import {Suite, expect} from "cynic"
import {ops} from "../../framework/ops.js"
import {StoreStatus} from "./api/services/types/store-status.js"
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
			"store status": {
				async "status starts uninitialized"() {
					const {storeModel} = await simpleStoreSetup()
					await storeModel.ecommerce.initialize()
					expect(ops.value(storeModel.state.statusOp))
						.equals(StoreStatus.Uninitialized)
				},
				async "after account is linked, status is disabled"() {
					const {storeModel} = await simpleStoreSetup("control store bank link")
					await storeModel.bank.linkStripeAccount()
					await storeModel.ecommerce.initialize()
					expect(ops.value(storeModel.state.statusOp))
						.equals(StoreStatus.Disabled)
				},
				async "bank linkage triggers store status update"() {
					const {storeModel} = await simpleStoreSetup("control store bank link")
					await storeModel.ecommerce.initialize()
					await storeModel.bank.linkStripeAccount()
					expect(ops.value(storeModel.state.statusOp))
						.equals(StoreStatus.Disabled)
				},
				async "enable and disable the store"() {
					const {storeModel} = await simpleStoreSetup(
						"control store bank link",
						"manage store",
					)
					await storeModel.bank.linkStripeAccount()
					await storeModel.ecommerce.initialize()
					expect(ops.value(storeModel.state.statusOp))
						.equals(StoreStatus.Disabled)
					await storeModel.ecommerce.enableStore()
					expect(ops.value(storeModel.state.statusOp))
						.equals(StoreStatus.Enabled)
					await storeModel.ecommerce.disableStore()
					expect(ops.value(storeModel.state.statusOp))
						.equals(StoreStatus.Disabled)
				},
				async "need permission to enable and disable the store"() {
					const {storeModel} = await simpleStoreSetup("control store bank link")
					await storeModel.bank.linkStripeAccount()
					await storeModel.ecommerce.initialize()
					expect(ops.value(storeModel.state.statusOp))
						.equals(StoreStatus.Disabled)
					expect(async() => storeModel.ecommerce.enableStore()).throws()
					expect(ops.value(storeModel.state.statusOp))
						.equals(StoreStatus.Disabled)
				},
			},
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
