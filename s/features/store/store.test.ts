
import {Suite, expect} from "cynic"

import {ops} from "../../framework/ops.js"
import {url} from "../../toolbox/darkvalley.js"
import {storePrivileges} from "./store-privileges.js"
import {storeTestSetup} from "./testing/store-test-setup.js"
import {StripeConnectStatus} from "./types/store-concepts.js"
import {setupSimpleStoreClient, setupLinkedStore, setupStoreWithSubscriptionsSetup} from "./testing/store-quick-setup.js"
import {unproxy} from "@chasemoskal/snapstate"

export default <Suite>{
	"store connect submodel": {
		"connect a stripe account": {

			async "merchant can connect a stripe account"() {
				const {storeModel, ...client} = await setupSimpleStoreClient(
					"control stripe account"
				)
				const getConnectDetails = () => ops.value(
					storeModel.state.stripeConnect.connectDetailsOp
				)
				expect(getConnectDetails()).not.ok()
				await storeModel.connectSubmodel.connectStripeAccount()
				expect(getConnectDetails()).ok()
				expect(ops.value(storeModel.state.stripeConnect.connectStatusOp))
					.equals(StripeConnectStatus.Ready)
				await client.setLoggedOut()
				expect(getConnectDetails()).not.ok()
			},
			async "merchant can link incomplete stripe account"() {
				const {storeModel, ...client} = await setupSimpleStoreClient(
					"control stripe account"
				)
				const getConnectDetails = () => ops.value(
					storeModel.state.stripeConnect.connectDetailsOp
				)
				expect(getConnectDetails()).not.ok()
				client.rigStripeLinkToFail()
				await storeModel.connectSubmodel.connectStripeAccount()
				expect(getConnectDetails()).ok()
				expect(ops.value(storeModel.state.stripeConnect.connectStatusOp))
					.equals(StripeConnectStatus.Incomplete)
				await client.setLoggedOut()
				expect(getConnectDetails()).not.ok()
			},
			async "plebeian cannot connect a stripe account"() {
				const {storeModel} = await setupSimpleStoreClient()
				await expect(
					async() => storeModel.connectSubmodel.connectStripeAccount()
				).throws()
			},
			async "a second merchant can see the connect details"() {
				const {merchantClient, makeAnotherMerchantClient}
					= await setupLinkedStore()
				expect(ops.value(merchantClient.storeModel.state.stripeConnect.connectDetailsOp)).ok()
	
				const anotherMerchant = await makeAnotherMerchantClient()
				await anotherMerchant.storeModel.connectSubmodel.initialize()
				expect(ops.value(anotherMerchant.storeModel.state.stripeConnect.connectDetailsOp)).ok()
			},
			async "plebeian cannot see connect status, but not connect details"() {
				const {makePlebeianClient} = await setupLinkedStore()
				const plebeianClient = await makePlebeianClient()
				await plebeianClient.storeModel.connectSubmodel.initialize()
				const {state} = plebeianClient.storeModel
				expect(ops.value(state.stripeConnect.connectStatusOp)).defined()
				expect(ops.value(state.stripeConnect.connectDetailsOp)).not.defined()
			},
			async "clerk can see the connect status, but not the details"() {
				const {makeClerkClient} = await setupLinkedStore()
				const clerkClient = await makeClerkClient()
				await clerkClient.storeModel.connectSubmodel.initialize()
				const {state} = clerkClient.storeModel
				expect(ops.value(state.stripeConnect.connectStatusOp)).defined()
				expect(ops.value(state.stripeConnect.connectDetailsOp)).not.defined()
			},

		},
		"pause and resume the stripe account": {

			async "merchant can pause and resume a store"() {
				const {merchantClient} = await setupLinkedStore()
				const {state, connectSubmodel} = merchantClient.storeModel
				function expectReady() {
					expect(ops.value(state.stripeConnect.connectStatusOp))
						.equals(StripeConnectStatus.Ready)
					expect(ops.value(state.stripeConnect.connectDetailsOp)?.paused)
						.equals(false)
				}
				function expectPaused() {
					expect(ops.value(state.stripeConnect.connectStatusOp))
						.equals(StripeConnectStatus.Paused)
					expect(ops.value(state.stripeConnect.connectDetailsOp)?.paused)
						.equals(true)
				}
				expectReady()
				await connectSubmodel.pause()
				expectPaused()
				await connectSubmodel.resume()
				expectReady()
			},
			async "clerk can pause and resume a store"() {
				const {makeClerkClient} = await setupLinkedStore()
				const clerkClient = await makeClerkClient()
				const {state, connectSubmodel} = clerkClient.storeModel
				function expectReady() {
					expect(ops.value(state.stripeConnect.connectStatusOp))
						.equals(StripeConnectStatus.Ready)
				}
				function expectPaused() {
					expect(ops.value(state.stripeConnect.connectStatusOp))
						.equals(StripeConnectStatus.Paused)
				}
				expectReady()
				await connectSubmodel.pause()
				expectPaused()
				await connectSubmodel.refresh()
				expectPaused()
				await connectSubmodel.resume()
				expectReady()
				await connectSubmodel.refresh()
				expectReady()
			},

		},
		"login to stripe account": {

			async "merchant can login to connected stripe account"() {
				const {merchantClient} = await setupLinkedStore()
				const {connectSubmodel} = merchantClient.storeModel
				const link = await connectSubmodel.generateStripeLoginLink()
				expect(url()(link).length).equals(0)
			},
			async "merchant cannot login to unconnected stripe account"() {
				const {storeModel} = await setupSimpleStoreClient("control stripe account")
				await expect(async() => storeModel.connectSubmodel.generateStripeLoginLink())
					.throws()
			},
			async "merchant can login to incomplete stripe account"() {
				const setup = await storeTestSetup()
				const client = await setup.makeClient()
				await client.setAccessWithPrivileges(storePrivileges["control stripe account"])
				client.rigStripeLinkToFail()
				const {connectSubmodel} = client.storeModel
				await connectSubmodel.connectStripeAccount()
				const link = await connectSubmodel.generateStripeLoginLink()
				expect(url()(link).length).equals(0)
			},
			async "clerk cannot login to stripe account"() {
				const setup = await setupLinkedStore()
				const client = await setup.makeClerkClient()
				const {connectSubmodel} = client.storeModel
				await expect(async () => connectSubmodel.generateStripeLoginLink())
					.throws()
			},
		},

	},
	"subscription planning": {

		"clerk can create a new subscription plan": async() => {
			const {makeClerkClient} = await setupLinkedStore()
			const clerk = await makeClerkClient()
			const {subscriptionPlanningSubmodel: planning} = clerk.storeModel

			await planning.initialize()
			const plans = ops.value(clerk.storeModel.state.subscriptionPlanning.subscriptionPlansOp)
			expect(plans.length).equals(0)

			const newPlan = await planning.addPlan({
				planLabel: "premium membership",
				tierLabel: "supporter",
				tierPrice: 10_00,
			})
			expect(newPlan.planId).ok()
			expect(newPlan.tiers.length).equals(1)

			await planning.refresh()
			const plans2 = ops.value(clerk.storeModel.state.subscriptionPlanning.subscriptionPlansOp)
			expect(plans2.length).equals(1)
			expect(plans2[0]).ok()
		},
		"other clerks can view subscription plans": async() => {
			const {makeClerkClient} = await setupLinkedStore()
			{
				const clerk = await makeClerkClient()
				const {subscriptionPlanningSubmodel: planning} = clerk.storeModel
				await Promise.all([
					planning.addPlan({
						planLabel: "premium membership",
						tierLabel: "supporter",
						tierPrice: 10_00,
					}),
					planning.addPlan({
						planLabel: "underground secret society",
						tierLabel: "accolyte",
						tierPrice: 100_00,
					}),
				])
			}
			{
				const clerk = await makeClerkClient()
				const {subscriptionPlanningSubmodel: planning} = clerk.storeModel
				await planning.initialize()
				const plans = ops.value(clerk.storeModel.state.subscriptionPlanning.subscriptionPlansOp)
				expect(plans.length).equals(2)
			}
		},
		"plebeians cannot view subscriptions from the planning perspective": async() => {
			const {makeClerkClient, makePlebeianClient} = await setupLinkedStore()
			{
				const clerk = await makeClerkClient()
				const {subscriptionPlanningSubmodel: planning} = clerk.storeModel
				await Promise.all([
					planning.addPlan({
						planLabel: "premium membership",
						tierLabel: "supporter",
						tierPrice: 10_00,
					}),
					planning.addPlan({
						planLabel: "underground secret society",
						tierLabel: "accolyte",
						tierPrice: 100_00,
					}),
				])
			}
			{
				const plebe = await makePlebeianClient()
				const {subscriptionPlanningSubmodel: planning} = plebe.storeModel
				await expect(async() => planning.initialize()).throws()
			}
		},

	},
	"billing": {

		async "user can add their payment method"() {
			const {makePlebeianClient} = await setupLinkedStore()
			const client = await makePlebeianClient()
			const {billingSubmodel, snap} = client.storeModel
			const getPaymentMethod = () => ops.value(
				snap.state.billing.paymentMethodOp
			)
			await billingSubmodel.initialize()
			expect(getPaymentMethod()).not.defined()
			await billingSubmodel.checkoutPaymentMethod()
			expect(getPaymentMethod()).ok()
		},
		async "user can add a payment method, and it's still there after re-logging in"() {
			const {makePlebeianClient, makeClient} = await setupLinkedStore()
			const clientFirstLogin = await makePlebeianClient()
			{
				const {billingSubmodel, snap} = clientFirstLogin.storeModel
				const getPaymentMethod = () => ops.value(
					snap.state.billing.paymentMethodOp
				)
				await billingSubmodel.initialize()
				expect(getPaymentMethod()).not.defined()
				await billingSubmodel.checkoutPaymentMethod()
				expect(getPaymentMethod()).ok()
			}
			{
				const client = await makeClient()
				await client.setAccess(ops.value(client.storeModel.state.user.accessOp))
				const {billingSubmodel, snap} = clientFirstLogin.storeModel
				const getPaymentMethod = () => ops.value(
					snap.state.billing.paymentMethodOp
				)
				await billingSubmodel.initialize()
				expect(getPaymentMethod()).ok()
			}
		},
		async "user can update their payment method"() {
			const {makePlebeianClient} = await setupLinkedStore()
			const client = await makePlebeianClient()
			const {billingSubmodel, snap} = client.storeModel
			const getPaymentMethod = () => ops.value(
				snap.state.billing.paymentMethodOp
			)
			await billingSubmodel.initialize()
			await billingSubmodel.checkoutPaymentMethod()
			expect(getPaymentMethod()).ok()
			const previousLast4 = getPaymentMethod()?.cardClues.last4
			await billingSubmodel.checkoutPaymentMethod()
			expect(getPaymentMethod()).ok()
			expect(getPaymentMethod()?.cardClues.last4)
				.not.equals(previousLast4)
		},
		async "user can delete their payment method"() {
			const {makePlebeianClient} = await setupLinkedStore()
			const client = await makePlebeianClient()
			const {billingSubmodel, snap} = client.storeModel
			const getPaymentMethod = () => ops.value(
				snap.state.billing.paymentMethodOp
			)
			await billingSubmodel.initialize()
			await billingSubmodel.checkoutPaymentMethod()
			expect(getPaymentMethod()).ok()
			await billingSubmodel.disconnectPaymentMethod()
			expect(getPaymentMethod()).not.ok()
		},

	},
	"subscription purchases": {

		async "user can purchase a subscription, with an existing payment method"() {
			const {makePlebeianClient} = await setupStoreWithSubscriptionsSetup()
			const client = await makePlebeianClient()
			// const {snap: {state}, subscriptionPlanningSubmodel: planning} = client.storeModel
			// await planning.initialize()
			// const getPlans = () => unproxy(
			// 	ops.value(state.subscriptionPlanning.subscriptionPlansOp)
			// )
			// expect(getPlans().length).equals(1)
		},
		async "user can purchase a subscription, while providing a new payment method"() {},
		async "user can cancel a subscription"() {},
		async "user can upgrade a subscription to a higher tier"() {},
		async "user can downgrade a subscription to a lower tier"() {},

	},
	"billing interactions with subscriptions": {

		async "when a user updates their payment method, subscriptions are updated"() {},
		async "when a user deletes their payment method, subscriptions will stop recurring"() {},

	},
}
