
import {Suite, expect} from "cynic"

import {ops} from "../../framework/ops.js"
import {storeTestSetup} from "./testing/store-test-setup.js"
import {StripeConnectStatus} from "./types/store-concepts.js"
import {appPermissions} from "../../assembly/backend/permissions/standard-permissions.js"
import {setupSimpleStoreClient, setupLinkedStore, setupStoreWithSubscriptionsSetup} from "./testing/store-quick-setup.js"

const adminRoleId = appPermissions.roles.admin.roleId

export default <Suite>{
	"managing the store": {
		"connect a stripe account": {
			"a user with merchant permissions": {

				async "can connect a stripe account"() {
					const {storeModel, ...client} = await setupSimpleStoreClient("admin")
					const getConnectDetails = () => ops.value(
						storeModel.state.stripeConnect.connectDetailsOp
					)
					expect(getConnectDetails()).not.ok()
					await storeModel.connectSubmodel.connectStripeAccount()
					expect(getConnectDetails()).ok()
					expect(ops.value(storeModel.state.stripeConnect.connectStatusOp))
						.equals(StripeConnectStatus.Ready)
					await client.accessModel.logout()
					expect(getConnectDetails()).not.ok()
				},
				async "can link incomplete stripe account"() {
					const {storeModel, ...client} = await setupSimpleStoreClient("admin")
					const getConnectDetails = () => ops.value(
						storeModel.state.stripeConnect.connectDetailsOp
					)
					expect(getConnectDetails()).not.ok()
					client.rigStripeLinkToFail()
					await storeModel.connectSubmodel.connectStripeAccount()
					expect(getConnectDetails()).ok()
					expect(ops.value(storeModel.state.stripeConnect.connectStatusOp))
						.equals(StripeConnectStatus.Incomplete)
					await client.accessModel.logout()
					expect(getConnectDetails()).not.ok()
				},
				async "can see the connect details set by another merchant"() {
					const {merchantClient, makeAnotherMerchantClient}
						= await setupLinkedStore()
					expect(ops.value(merchantClient.storeModel.state.stripeConnect.connectDetailsOp)).ok()
		
					const anotherMerchant = await makeAnotherMerchantClient()
					await anotherMerchant.storeModel.connectSubmodel.initialize()
					expect(ops.value(anotherMerchant.storeModel.state.stripeConnect.connectDetailsOp)).ok()
				},

			},
			"a user with clerk permissions": {

				async "can see the connect status, but not the details"() {
					const {makeClerkClient} = await setupLinkedStore()
					const clerkClient = await makeClerkClient()
					await clerkClient.storeModel.connectSubmodel.initialize()
					const {state} = clerkClient.storeModel
					expect(ops.value(state.stripeConnect.connectStatusOp)).defined()
					expect(ops.value(state.stripeConnect.connectDetailsOp)).not.defined()
				},

			},
			"a user with regular permissions": {

				async "cannot connect a stripe account"() {
					const {storeModel} = await setupSimpleStoreClient()
					await expect(
						async() => storeModel.connectSubmodel.connectStripeAccount()
					).throws()
				},
				async "can see connect status, but not connect details"() {
					const {makeRegularClient} = await setupLinkedStore()
					const client = await makeRegularClient()
					await client.storeModel.connectSubmodel.initialize()
					const {state} = client.storeModel
					expect(ops.value(state.stripeConnect.connectStatusOp)).defined()
					expect(ops.value(state.stripeConnect.connectDetailsOp)).not.defined()
				},

			},
		},
		"pause and resume the stripe account": {
			"a user with merchant permissions": {

				async "can pause and resume a store"() {
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

			},
			"a user with clerk permissions": {
				async "can pause and resume a store"() {
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
			"a user with regular permissions": {

				async "cannot pause or resume the store"() {
					const {makeRegularClient} = await setupLinkedStore()
					const client = await makeRegularClient()
					const {connectSubmodel} = client.storeModel
					expect(async() => connectSubmodel.pause()).throws()
					expect(async() => connectSubmodel.resume()).throws()
				},

			},
		},
		"login to stripe account": {
			"a user with merchant permissions": {

				async "can login to connected stripe account"() {
					const {merchantClient} = await setupLinkedStore()
					const {connectSubmodel} = merchantClient.storeModel
					await connectSubmodel.stripeLogin()
					expect(merchantClient.getStripeLoginCount()).equals(1)
				},
				async "cannot login to unconnected stripe account"() {
					const {storeModel, getStripeLoginCount} = await setupSimpleStoreClient("admin")
					await expect(async() => storeModel.connectSubmodel.stripeLogin())
						.throws()
					expect(getStripeLoginCount()).equals(0)
				},
				async "can login to incomplete stripe account"() {
					const setup = await storeTestSetup()
					const client = await setup.makeClient(adminRoleId)
					client.rigStripeLinkToFail()
					const {connectSubmodel} = client.storeModel
					await connectSubmodel.connectStripeAccount()
					await connectSubmodel.stripeLogin()
					expect(client.getStripeLoginCount()).equals(1)
				},
				async "can login to complete an incomplete account"() {
					const setup = await storeTestSetup()
					const client = await setup.makeClient(adminRoleId)
					client.rigStripeLinkToFail()
					const {connectSubmodel} = client.storeModel
					await connectSubmodel.connectStripeAccount()
					client.rigStripeLoginToConfigureCompleteAccount()
					await connectSubmodel.stripeLogin()
					expect(client.getStripeLoginCount()).equals(1)
					await connectSubmodel.refresh()
					const {state} = client.storeModel.snap
					const connectStatus = ops.value(state.stripeConnect.connectStatusOp)
					expect(connectStatus).equals(StripeConnectStatus.Ready)
				},
				async "can login to change an account to become incomplete"() {
					const setup = await storeTestSetup()
					const client = await setup.makeClient(adminRoleId)
					const {connectSubmodel} = client.storeModel
					client.rigStripeLinkToSucceed()
					await connectSubmodel.connectStripeAccount()
					client.rigStripeLoginToConfigureIncompleteAccount()
					await connectSubmodel.stripeLogin()
					expect(client.getStripeLoginCount()).equals(1)
					await connectSubmodel.refresh()
					const {state} = client.storeModel.snap
					const connectStatus = ops.value(state.stripeConnect.connectStatusOp)
					expect(connectStatus).equals(StripeConnectStatus.Incomplete)
				},

			},
			"a user with clerk permissions": {

				async "cannot login to stripe account"() {
					const setup = await setupLinkedStore()
					const client = await setup.makeClerkClient()
					const {connectSubmodel} = client.storeModel
					await expect(async () => connectSubmodel.stripeLogin())
						.throws()
				},

			},
			"a user with regular permissions": {

				async "cannot login to stripe account"() {
					const setup = await setupLinkedStore()
					const client = await setup.makeRegularClient()
					const {connectSubmodel} = client.storeModel
					await expect(async () => connectSubmodel.stripeLogin())
						.throws()
				},

			},
		},

	},
	"subscription planning": {
		"a user with clerk permisisons": {

			async "can create a new subscription plan"() {
				const {makeClerkClient} = await setupLinkedStore()
				const clerk = await makeClerkClient()
				const {subscriptionsSubmodel} = clerk.storeModel

				await subscriptionsSubmodel.initialize()
				const plans = ops.value(clerk.storeModel.state.subscriptions.subscriptionPlansOp)
				expect(plans.length).equals(0)

				const newPlan = await subscriptionsSubmodel.addPlan({
					planLabel: "premium membership",
					tierLabel: "supporter",
					tierPrice: 10_00,
				})
				expect(newPlan.planId).ok()
				expect(newPlan.tiers.length).equals(1)

				await subscriptionsSubmodel.refresh()
				const plans2 = ops.value(clerk.storeModel.state.subscriptions.subscriptionPlansOp)
				expect(plans2.length).equals(1)
				expect(plans2[0]).ok()
				expect(plans2[0].tiers.length).equals(1)
			},
			async "can create multiple plans, and the tiers aren't scrambled"() {
				const {makeClerkClient} = await setupLinkedStore()
				const clerk = await makeClerkClient()
				const {subscriptionsSubmodel, snap: {state}} = clerk.storeModel
				const getPlans = () => ops.value(state.subscriptions.subscriptionPlansOp)
				const getPlan = (id: string) => getPlans().find(p => p.planId === id)

				await subscriptionsSubmodel.initialize()
				expect(getPlans().length).equals(0)

				const newPlan1 = await subscriptionsSubmodel.addPlan({
					planLabel: "video membership",
					tierLabel: "all videos",
					tierPrice: 10_00,
				})
				expect(getPlans().length).equals(1)
				expect(getPlan(newPlan1.planId)).ok()
				expect(getPlan(newPlan1.planId).tiers.length).equals(1)

				const newPlan2 = await subscriptionsSubmodel.addPlan({
					planLabel: "deluxe membership",
					tierLabel: "deluxe",
					tierPrice: 20_00,
				})
				expect(getPlans().length).equals(2)
				expect(getPlan(newPlan2.planId)).ok()
				expect(getPlan(newPlan2.planId).tiers.length).equals(1)
				expect(getPlan(newPlan1.planId)).ok()
				expect(getPlan(newPlan1.planId).tiers.length).equals(1)

				await subscriptionsSubmodel.refresh()
				expect(getPlans().length).equals(2)
				expect(getPlan(newPlan2.planId)).ok()
				expect(getPlan(newPlan2.planId).tiers.length).equals(1)
				expect(getPlan(newPlan1.planId)).ok()
				expect(getPlan(newPlan1.planId).tiers.length).equals(1)
			},
			async "can view subscription plans made by other clerks"() {
				const {makeClerkClient} = await setupLinkedStore()
				{
					const clerk = await makeClerkClient()
					const {subscriptionsSubmodel} = clerk.storeModel
					await Promise.all([
						subscriptionsSubmodel.addPlan({
							planLabel: "premium membership",
							tierLabel: "supporter",
							tierPrice: 10_00,
						}),
						subscriptionsSubmodel.addPlan({
							planLabel: "underground secret society",
							tierLabel: "accolyte",
							tierPrice: 100_00,
						}),
					])
				}
				{
					const clerk = await makeClerkClient()
					const {subscriptionsSubmodel} = clerk.storeModel
					await subscriptionsSubmodel.initialize()
					const plans = ops.value(clerk.storeModel.state.subscriptions.subscriptionPlansOp)
					expect(plans.length).equals(2)
				}
			},

		},
		"a user with regular permissions": {

			async "can view subscriptions"() {
				const {makeClerkClient, makeRegularClient} = await setupLinkedStore()
				{
					const clerk = await makeClerkClient()
					const {subscriptionsSubmodel} = clerk.storeModel
					await Promise.all([
						subscriptionsSubmodel.addPlan({
							planLabel: "premium membership",
							tierLabel: "supporter",
							tierPrice: 10_00,
						}),
						subscriptionsSubmodel.addPlan({
							planLabel: "underground secret society",
							tierLabel: "accolyte",
							tierPrice: 100_00,
						}),
					])
				}
				{
					const client = await makeRegularClient()
					const {snap: {state}, subscriptionsSubmodel} = client.storeModel
					await subscriptionsSubmodel.initialize()
					expect(ops.value(state.subscriptions.subscriptionPlansOp).length).equals(2)
				}
			},
			async "cannot create a new subscription plan"() {
				const {makeRegularClient} = await setupLinkedStore()
				const client = await makeRegularClient()
				const {subscriptionsSubmodel} = client.storeModel

				await subscriptionsSubmodel.initialize()
				await expect(async() => {
					await subscriptionsSubmodel.addPlan({
						planLabel: "premium membership",
						tierLabel: "supporter",
						tierPrice: 10_00,
					})
				}).throws()
			},

		},
	},
	"billing": {
		"a user with regular permissions": {

			async "can add their payment method"() {
				const {makeRegularClient} = await setupLinkedStore()
				const client = await makeRegularClient()
				const {billingSubmodel, snap} = client.storeModel
				const getPaymentMethod = () => ops.value(
					snap.state.billing.paymentMethodOp
				)
				await billingSubmodel.initialize()
				expect(getPaymentMethod()).not.defined()
				await billingSubmodel.checkoutPaymentMethod()
				expect(getPaymentMethod()).ok()
			},
			async "can add a payment method, and it's still there after re-logging in"() {
				const {makeRegularClient, makeClient} = await setupLinkedStore()
				const clientFirstLogin = await makeRegularClient()
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
					await client.accessModel.logout()
					await client.logBackIn()
					const {billingSubmodel, snap} = clientFirstLogin.storeModel
					const getPaymentMethod = () => ops.value(
						snap.state.billing.paymentMethodOp
					)
					await billingSubmodel.initialize()
					expect(getPaymentMethod()).ok()
				}
			},
			async "can update their payment method"() {
				const {makeRegularClient} = await setupLinkedStore()
				const client = await makeRegularClient()
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
			async "can delete their payment method"() {
				const {makeRegularClient} = await setupLinkedStore()
				const client = await makeRegularClient()
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
	},
	"subscription purchases": {
		"a user with regular permissions": {

			async "can purchase a subscription, with an existing payment method"() {
				const {makeRegularClient} = await setupStoreWithSubscriptionsSetup()
				const client = await makeRegularClient()
				const {
					storeModel: {snap: {state}, billingSubmodel, subscriptionsSubmodel}
				} = client
				await billingSubmodel.initialize()
				await billingSubmodel.checkoutPaymentMethod()
				await subscriptionsSubmodel.initialize()
				const [plan] = ops.value(state.subscriptions.subscriptionPlansOp)
				const [tier] = plan.tiers
				await subscriptionsSubmodel.checkoutSubscriptionTier(tier.tierId)

				// TODO
			},
			async "can purchase a subscription, while providing a new payment method"() {},
			async "can cancel a subscription"() {},
			async "can upgrade a subscription to a higher tier"() {},
			async "can downgrade a subscription to a lower tier"() {},

		},
	},
	"billing interactions with subscriptions": {
		"a user with regular permissions": {

			async "can update their payment method, for recurring billing on subscriptions"() {},
			async "can delete their payment method, ending recurring billing on subscriptions"() {},
			async "can add a payment method, reactivating recurring billing for subscriptions"() {},

		},
	},
}
