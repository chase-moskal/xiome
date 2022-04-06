
import {Suite, expect} from "cynic"

import {ops} from "../../framework/ops.js"
import {storeTestSetup} from "./testing/store-test-setup.js"
import {StripeConnectStatus, SubscriptionStatus} from "./types/store-concepts.js"
import {appPermissions} from "../../assembly/backend/permissions/standard-permissions.js"
import {setupSimpleStoreClient, setupLinkedStore, setupStoreWithSubscriptionsSetup} from "./testing/store-quick-setup.js"

const adminRoleId = appPermissions.roles.admin.roleId

export default <Suite>{
	"managing the store": {
		"connect a stripe account": {
			"a user with merchant permissions": {

				async "can connect a stripe account"() {
					const {storeModel, ...client} = await setupSimpleStoreClient("admin")
					await storeModel.initialize()
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
					await storeModel.initialize()
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
					await anotherMerchant.storeModel.initialize()
					expect(ops.value(anotherMerchant.storeModel.state.stripeConnect.connectDetailsOp)).ok()
				},

			},
			"a user with clerk permissions": {

				async "can see the connect status, but not the details"() {
					const {makeClerkClient} = await setupLinkedStore()
					const clerkClient = await makeClerkClient()
					await clerkClient.storeModel.initialize()
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
					await client.storeModel.initialize()
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
					await clerkClient.storeModel.refresh()
					expectPaused()
					await connectSubmodel.resume()
					expectReady()
					await clerkClient.storeModel.refresh()
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
					await client.storeModel.initialize()
					client.rigStripeLinkToFail()
					const {connectSubmodel} = client.storeModel
					await connectSubmodel.connectStripeAccount()
					client.rigStripeLoginToConfigureCompleteAccount()
					await connectSubmodel.stripeLogin()
					expect(client.getStripeLoginCount()).equals(1)
					await client.storeModel.refresh()
					const {state} = client.storeModel.snap
					const connectStatus = ops.value(state.stripeConnect.connectStatusOp)
					expect(connectStatus).equals(StripeConnectStatus.Ready)
				},
				async "can login to change an account to become incomplete"() {
					const setup = await storeTestSetup()
					const client = await setup.makeClient(adminRoleId)
					await client.storeModel.initialize()
					const {connectSubmodel} = client.storeModel
					client.rigStripeLinkToSucceed()
					await connectSubmodel.connectStripeAccount()
					client.rigStripeLoginToConfigureIncompleteAccount()
					await connectSubmodel.stripeLogin()
					expect(client.getStripeLoginCount()).equals(1)
					await client.storeModel.refresh()
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

				await clerk.storeModel.initialize()
				const plans = ops.value(clerk.storeModel.state.subscriptions.subscriptionPlansOp)
				expect(plans.length).equals(0)

				const newPlan = await subscriptionsSubmodel.addPlan({
					planLabel: "premium membership",
					tierLabel: "supporter",
					tierPrice: 10_00,
				})
				expect(newPlan.planId).ok()
				expect(newPlan.tiers.length).equals(1)

				await clerk.storeModel.refresh()
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

				await clerk.storeModel.initialize()
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

				await clerk.storeModel.refresh()
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
					await clerk.storeModel.initialize()
					const plans = ops.value(clerk.storeModel.state.subscriptions.subscriptionPlansOp)
					expect(plans.length).equals(2)
				}
			},
			async "can add a new tier to an existing plan"() {
				const store = await setupLinkedStore()
				const clerk = await store.makeClerkClient()
				await clerk.storeModel.initialize()
				const {planId} = await clerk.storeModel.subscriptionsSubmodel
					.addPlan({
						planLabel: "membership",
						tierLabel: "benevolent donor",
						tierPrice: 5_00,
					})
				const {tierId} = await clerk.storeModel.subscriptionsSubmodel
					.addTier({
						currency: "usd",
						interval: "month",
						label: "deluxe",
						planId,
						price: 10_000,
					})
				const plans = ops.value(
					clerk.storeModel.state.subscriptions.subscriptionPlansOp
				)
				const plan = plans.find(plan => plan.planId === planId)
				const tier = plan.tiers.find(tier => tier.tierId === tierId)
				expect(tier).ok()
				expect(tier.price).equals(10_000)
				const anotherClerk = await store.makeClerkClient()
				anotherClerk.storeModel.initialize()
				const anotherPlans = ops.value(
					clerk.storeModel.state.subscriptions.subscriptionPlansOp
				)
				const anotherPlan = anotherPlans
					.find(plan => plan.planId === planId)
				const anotherTier = anotherPlan.tiers
					.find(tier => tier.tierId === tierId)
				expect(anotherTier).ok()
				expect(anotherTier.price).equals(10_000)
			},
			async "can edit a plan"() {
				const store = await setupLinkedStore()
				const clerk = await store.makeClerkClient()
				await clerk.storeModel.initialize()
				const plan = await clerk.storeModel.subscriptionsSubmodel
					.addPlan({
						planLabel: "membership",
						tierLabel: "benevolent donor",
						tierPrice: 5_00,
					})
				function getPlan(planId: string) {
					const {subscriptionPlansOp} = clerk.storeModel.state.subscriptions
					const plans = ops.value(subscriptionPlansOp)
					return plans.find(plan => plan.planId === planId)
				}
				expect(getPlan(plan.planId).label).equals("membership")
				await clerk.storeModel.subscriptionsSubmodel.editPlan({
					planId: plan.planId,
					active: true,
					label: "premium",
				})
				expect(getPlan(plan.planId).label).equals("premium")
				await clerk.storeModel.subscriptionsSubmodel.editPlan({
					planId: plan.planId,
					active: false,
					label: "premium",
				})
				expect(getPlan(plan.planId).active).equals(false)
			},
			async "can edit a tier"() {
				const store = await setupLinkedStore()
				const clerk = await store.makeClerkClient()
				await clerk.storeModel.initialize()
				const plan = await clerk.storeModel.subscriptionsSubmodel
					.addPlan({
						planLabel: "membership",
						tierLabel: "benevolent donor",
						tierPrice: 5_00,
					})
				function getFirstTier() {
					const {subscriptionPlansOp} = clerk.storeModel.state.subscriptions
					const plans = ops.value(subscriptionPlansOp)
					const [plan] = plans
					const [tier] = plan.tiers
					return tier
				}
				const tier1 = getFirstTier()
				expect(tier1).ok()
				expect(tier1.active).equals(true)
				expect(tier1.label).equals("benevolent donor")
				expect(tier1.price).equals(5_00)

				await clerk.storeModel.subscriptionsSubmodel.editTier({
					planId: plan.planId,
					tierId: tier1.tierId,
					active: tier1.active,
					label: "test",
				})
				const tier2 = getFirstTier()
				expect(tier2.label).equals("test")
				expect(tier2.active).equals(tier1.active)
				expect(tier2.price).equals(tier1.price)

				await clerk.storeModel.subscriptionsSubmodel.editTier({
					planId: plan.planId,
					tierId: tier2.tierId,
					label: tier2.label,
					active: false,
				})
				const tier3 = getFirstTier()
				expect(tier3.active).equals(false)
				expect(tier3.label).equals(tier2.label)
				expect(tier3.price).equals(tier2.price)
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
					await client.storeModel.initialize()
					expect(ops.value(state.subscriptions.subscriptionPlansOp).length).equals(2)
				}
			},
			async "cannot create a new subscription plan"() {
				const {makeRegularClient} = await setupLinkedStore()
				const client = await makeRegularClient()
				const {subscriptionsSubmodel} = client.storeModel

				await client.storeModel.initialize()
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
				await client.storeModel.initialize()
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
					await clientFirstLogin.storeModel.initialize()
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
					await clientFirstLogin.storeModel.initialize()
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
				await client.storeModel.initialize()
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
				await client.storeModel.initialize()
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
					accessModel,
					storeModel: {snap: {state}, billingSubmodel, subscriptionsSubmodel},
				} = client

				await client.storeModel.initialize()
				await billingSubmodel.checkoutPaymentMethod()
				const [plan] = ops.value(state.subscriptions.subscriptionPlansOp)
				const [tier] = plan.tiers

				function userHasRoleId(roleId: string) {
					return !!accessModel.getAccess().user
						.roles.find(role => role.roleId === roleId)
				}

				expect(userHasRoleId(plan.roleId)).not.ok()
				expect(userHasRoleId(tier.roleId)).not.ok()

				await subscriptionsSubmodel.createNewSubscriptionForTier(tier.tierId)

				expect(userHasRoleId(plan.roleId)).ok()
				expect(userHasRoleId(tier.roleId)).ok()
			},
			async "can purchase a subscription, while providing a new payment method"() {
				const {makeRegularClient} = await setupStoreWithSubscriptionsSetup()
				const client = await makeRegularClient()
				const {
					accessModel,
					storeModel: {snap: {state}, billingSubmodel, subscriptionsSubmodel},
				} = client
				await client.storeModel.initialize()
				const [plan] = ops.value(state.subscriptions.subscriptionPlansOp)
				const [tier] = plan.tiers

				function userHasRoleId(roleId: string) {
					return !!accessModel.getAccess().user
						.roles.find(role => role.roleId === roleId)
				}

				expect(userHasRoleId(plan.roleId)).not.ok()
				expect(userHasRoleId(tier.roleId)).not.ok()

				await subscriptionsSubmodel.checkoutSubscriptionTier(tier.tierId)
				expect(userHasRoleId(plan.roleId)).ok()
				expect(userHasRoleId(tier.roleId)).ok()
			},
			async "can cancel and uncancel a subscription"() {
				const {makeRegularClient} = await setupStoreWithSubscriptionsSetup()
				const client = await makeRegularClient()
				const {
					accessModel,
					storeModel: {snap: {state}, billingSubmodel, subscriptionsSubmodel},
				} = client
				await client.storeModel.initialize()
				const [plan] = ops.value(state.subscriptions.subscriptionPlansOp)
				const [tier] = plan.tiers

				function userHasRoleId(roleId: string) {
					return !!accessModel.getAccess().user
						.roles.find(role => role.roleId === roleId)
				}

				await subscriptionsSubmodel.checkoutSubscriptionTier(tier.tierId)
				expect(userHasRoleId(tier.roleId)).ok()

				function getSubscriptionStatus() {
					return ops.value(
						state.subscriptions.subscriptionDetailsOp
					)?.status
				}

				await subscriptionsSubmodel.cancelSubscription()
				expect(getSubscriptionStatus())
					.equals(SubscriptionStatus.Cancelled)

				await subscriptionsSubmodel.uncancelSubscription()
				expect(getSubscriptionStatus())
					.equals(SubscriptionStatus.Active)
			},
			async "can upgrade a subscription to a higher tier"() {
				const store = await setupLinkedStore()
				const clerk = await store.makeClerkClient()
				await clerk.storeModel.initialize()
				const {planId} = await clerk.storeModel.subscriptionsSubmodel
					.addPlan({
						planLabel: "membership",
						tierLabel: "benevolent donor",
						tierPrice: 5_00,
					})
				await clerk.storeModel.subscriptionsSubmodel
					.addTier({
						currency: "usd",
						interval: "month",
						label: "deluxe",
						planId,
						price: 10_000,
					})
				const {
					state, billingSubmodel, subscriptionsSubmodel,
				} = clerk.storeModel
				await clerk.storeModel.initialize()
				await billingSubmodel.checkoutPaymentMethod()
				const [plan] = ops.value(state.subscriptions.subscriptionPlansOp)
				const [tier1, tier2] = plan.tiers

				function userHasRoleId(roleId: string) {
					return !!clerk.accessModel.getAccess().user
						.roles.find(role => role.roleId === roleId)
				}
				expect(userHasRoleId(plan.roleId)).not.ok()
				expect(userHasRoleId(tier1.roleId)).not.ok()

				await subscriptionsSubmodel.createNewSubscriptionForTier(tier1.tierId)
				expect(userHasRoleId(plan.roleId)).ok()
				expect(userHasRoleId(tier1.roleId)).ok()

				await subscriptionsSubmodel.updateExistingSubscriptionWithNewTier(tier2.tierId)
				expect(userHasRoleId(plan.roleId)).ok()
				expect(userHasRoleId(tier1.roleId)).ok()
				expect(userHasRoleId(tier2.roleId)).ok()
			},
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
