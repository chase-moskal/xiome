
import {Suite, expect} from "cynic"
import {ops} from "../../framework/ops.js"
import {StoreStatus} from "./api/services/types/store-status.js"
import {merchantStoreSetup, plebeianStoreSetup, simpleStoreSetup} from "./testing/store-quick-setups.js"

export default <Suite>{
	"shopkeeping": {
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
				await storeModel.ecommerce.activate()
				expect(ops.value(storeModel.state.statusOp))
					.equals(StoreStatus.Uninitialized)
			},
			async "after account is linked, status is disabled"() {
				const {storeModel} = await simpleStoreSetup("control store bank link")
				await storeModel.bank.linkStripeAccount()
				await storeModel.ecommerce.activate()
				expect(ops.value(storeModel.state.statusOp))
					.equals(StoreStatus.Disabled)
			},
			async "bank linkage triggers store status update"() {
				const {storeModel} = await simpleStoreSetup("control store bank link")
				await storeModel.ecommerce.activate()
				await storeModel.bank.linkStripeAccount()
				expect(ops.value(storeModel.state.statusOp))
					.equals(StoreStatus.Disabled)
			},
			async "after bank link failure, status is unlinked"() {
				const {storeModel, ...client} = await simpleStoreSetup("control store bank link")
				client.rigBankLinkToFail()
				await storeModel.bank.linkStripeAccount()
				await storeModel.ecommerce.activate()
				expect(ops.value(storeModel.state.statusOp))
					.equals(StoreStatus.Unlinked)
				client.rigBankLinkToSucceed()
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
				await storeModel.ecommerce.activate()
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
				await storeModel.ecommerce.activate()
				expect(ops.value(storeModel.state.statusOp))
					.equals(StoreStatus.Disabled)
				await expect(async() => storeModel.ecommerce.enableStore()).throws()
				expect(ops.value(storeModel.state.statusOp))
					.equals(StoreStatus.Disabled)
			},
		},
	},
	"subscriptions": {
		"subscription planning": {
			"management of subscription plans": {
				async "merchant can create plans"() {
					const {storeModel} = await merchantStoreSetup()
					expect(storeModel.planning.planningAllowed).ok()
					await storeModel.planning.activate()
					expect(ops.isReady(storeModel.state.subscriptionPlansOp)).ok()
					expect(ops.value(storeModel.state.subscriptionPlansOp).length).equals(0)

					const label = "super deluxe premium"
					const price = 10_00
					const plan = await storeModel.planning.createPlan({label, price})
					expect(plan).ok()
					expect(ops.value(storeModel.state.subscriptionPlansOp).length).equals(1)
					expect(ops.value(storeModel.state.subscriptionPlansOp)[0].active).equals(true)
					expect(ops.value(storeModel.state.subscriptionPlansOp)[0].label).equals(label)
					expect(ops.value(storeModel.state.subscriptionPlansOp)[0].price).equals(price)
					expect(ops.value(storeModel.state.subscriptionPlansOp)[0].roleId).ok()
					expect(ops.value(storeModel.state.subscriptionPlansOp)[0].subscriptionPlanId).ok()

					await storeModel.planning.createPlan({price: 10_00, label: "b"})
					await storeModel.planning.createPlan({price: 10_00, label: "c"})
					expect(ops.value(storeModel.state.subscriptionPlansOp).length).equals(3)
					await storeModel.planning.refresh()
					expect(ops.value(storeModel.state.subscriptionPlansOp).length).equals(3)
				},
				async "plebeian cannot create a plan"() {
					const {storeModel} = await plebeianStoreSetup()
					expect(storeModel.planning.planningAllowed).not.ok()
					await storeModel.planning.activate()
					await expect(
						async() => storeModel.planning.createPlan({price: 10_00, label: "a"})
					).throws()
					expect(ops.value(storeModel.state.subscriptionPlansOp)).ok()
					expect(ops.value(storeModel.state.subscriptionPlansOp).length).equals(0)
				},
				async "merchant who switches to plebeian cannot create plans"() {
					const {storeModel, setAccessWithPrivileges} = await merchantStoreSetup()
					await storeModel.planning.activate()
					await storeModel.planning.createPlan({
						label: "super deluxe premium",
						price: 10_00,
					})
					expect(ops.value(storeModel.state.subscriptionPlansOp).length).equals(1)
					await setAccessWithPrivileges()
					expect(ops.value(storeModel.state.subscriptionPlansOp).length).equals(0)
				},
			},
			"deactivation of subscription plans": {
				async "merchant can deactivate a plan"() {
					const {storeModel} = await merchantStoreSetup()
					await storeModel.planning.activate()
					const plan = await storeModel.planning.createPlan({
						price: 10_00,
						label: "a",
					})
					const getPlans = () => ops.value(storeModel.state.subscriptionPlansOp)
					expect(getPlans()).ok()
					expect(getPlans()[0]).ok()
					expect(getPlans()[0].active).ok()
					await storeModel.planning.deactivatePlan(plan.subscriptionPlanId)
					expect(getPlans()[0].active).not.ok()
					await storeModel.planning.refresh()
					expect(getPlans()[0].active).not.ok()
				},
				async "plebeian cannot deactivate a plan"() {
					const {storeModel, setAccessWithPrivileges} = await merchantStoreSetup()
					await storeModel.planning.activate()
					const plan = await storeModel.planning.createPlan({
						price: 10_00,
						label: "a",
					})
					await setAccessWithPrivileges()
					await expect(async() =>
						storeModel.planning.deactivatePlan(plan.subscriptionPlanId)
					).throws()
				},
			},
		},
		"subscription sales": {
			async "customer can purchase a subscription"() {},
			async "customer can cancel a subscription"() {},
			async "customer can update subscription's payment method"() {},
			async "subscription ends if automatic renewal fails"() {},
		},
		"subscription bookkeeping": {
			async "merchant can see how many active subscriptions a plan has"() {},
			async "customer can view a subscription's details"() {},
			async "customer can view payment history"() {},
		},
	},
	"digital products": {
		async "merchant can manage digital product listings"() {},
		async "customer can purchase a digital product"() {},
		async "customer can obtain product ownership tokens"() {},
	},
}
