
import {Suite, expect} from "cynic"
import {storeTestSetup} from "./testing/store-test-setup.js"
import {StripeConnectStatus} from "./types/store-concepts.js"

const setups = {
	async linkedStore() {
		const api = await storeTestSetup()
			.then(x => x.api())
		const merchant = await api.client(api.roles.merchant)
			.then(x => x.browserTab())
		await merchant.store.connect.connectStripeAccount()
		return {api, merchant}
	},
}

export default <Suite>{
	"managing the store": {
		"connect a stripe account": {
			"a user with merchant permissions": {
				async "can connect a stripe account"() {
					const {store} = await storeTestSetup()
						.then(x => x.api())
						.then(x => x.client(x.roles.merchant))
						.then(x => x.browserTab())
					expect(store.get.connect.details).not.ok()
					await store.connect.connectStripeAccount()
					expect(store.get.connect.details).ok()
					expect(store.get.connect.status).equals(StripeConnectStatus.Ready)
				},
				async "can connect an incomplete stripe account"() {
					const {store, rig, logout} = await storeTestSetup()
						.then(x => x.api())
						.then(x => x.client(x.roles.merchant))
						.then(x => x.browserTab())
					expect(store.get.connect.details).not.ok()
					rig.stripeAccountFate = "incomplete"
					await store.connect.connectStripeAccount()
					expect(store.get.connect.details).ok()
					expect(store.get.connect.status)
						.equals(StripeConnectStatus.Incomplete)
					await logout()
					expect(store.get.connect.details).not.ok()
				},
				async "can see the connect details set by another merchant"() {
					const api = await storeTestSetup()
						.then(x => x.api())
					const merchant1 = await api.client(api.roles.merchant)
						.then(x => x.browserTab())
					await merchant1.store.connect.connectStripeAccount()
					const merchant2 = await api.client(api.roles.merchant)
						.then(x => x.browserTab())
					expect(merchant2.store.get.connect.details).ok()
				},
			},
			"a user with clerk permissions": {
				async "can see connect status, but not details"() {
					const {api} = await setups.linkedStore()
					const {store} = await api.client(api.roles.clerk)
						.then(x => x.browserTab())
					expect(store.get.connect.status).defined()
					expect(store.get.connect.details).not.defined()
				},
				async "cannot connect a stripe account"() {
					const {store} = await storeTestSetup()
						.then(x => x.api())
						.then(x => x.client(x.roles.clerk))
						.then(x => x.browserTab())
					await expect(async() => store.connect.connectStripeAccount())
						.throws()
				},
			},
			"a user with customer permissions": {
				async "cannot connect a stripe account"() {
					const {store} = await storeTestSetup()
						.then(x => x.api())
						.then(x => x.client(x.roles.customer))
						.then(x => x.browserTab())
					await expect(async() => store.connect.connectStripeAccount())
						.throws()
				},
				async "can see connect status, but not details"() {
					const {api} = await setups.linkedStore()
					const {store} = await api.client(api.roles.customer)
						.then(x => x.browserTab())
					expect(store.get.connect.status).defined()
					expect(store.get.connect.details).not.defined()
				},
			},
		},
		"login to stripe account": {
			"a user with merchant permissions": {
				async "can login to stripe account and toggle between complete/incomplete"() {
					const {store, rig} = await setups.linkedStore()
						.then(x => x.api.client(x.api.roles.merchant))
						.then(x => x.browserTab())
					rig.stripeAccountFate = "incomplete"
					await store.connect.stripeLogin()
					expect(store.get.connect.status).equals(StripeConnectStatus.Incomplete)
					rig.stripeAccountFate = "complete"
					await store.connect.stripeLogin()
					expect(store.get.connect.status).equals(StripeConnectStatus.Ready)
				},
				async "cannot login to unconnected stripe account"() {
					const {store} = await storeTestSetup()
						.then(x => x.api())
						.then(x => x.client(x.roles.merchant))
						.then(x => x.browserTab())
					await expect(async() => store.connect.stripeLogin())
						.throws()
				},
			},
			"a user with clerk permissions": {
				async "cannot login to stripe account"() {
					const {store} = await setups.linkedStore()
						.then(x => x.api.client(x.api.roles.clerk))
						.then(x => x.browserTab())
					await expect(async() => store.connect.stripeLogin())
						.throws()
				},
			},
			"a user with customer permissions": {
				async "cannot login to stripe account"() {
					const {store} = await setups.linkedStore()
						.then(x => x.api.client(x.api.roles.customer))
						.then(x => x.browserTab())
					await expect(async() => store.connect.stripeLogin())
						.throws()
				},
			},
		},
		"pause and resume the store": {
			"a user with merchant permissions": {
				async "can pause and resume a store"() {
					const {store} = await setups.linkedStore()
						.then(x => x.api.client(x.api.roles.merchant))
						.then(x => x.browserTab())
					expect(store.get.connect.status).equals(StripeConnectStatus.Ready)
					await store.connect.pause()
					expect(store.get.connect.status).equals(StripeConnectStatus.Paused)
					await store.connect.resume()
					expect(store.get.connect.status).equals(StripeConnectStatus.Ready)
				},
			},
			"a user with clerk permissions": {
				async "can pause and resume a store"() {
					const {store} = await setups.linkedStore()
						.then(x => x.api.client(x.api.roles.clerk))
						.then(x => x.browserTab())
					expect(store.get.connect.status).equals(StripeConnectStatus.Ready)
					await store.connect.pause()
					expect(store.get.connect.status).equals(StripeConnectStatus.Paused)
					await store.connect.resume()
					expect(store.get.connect.status).equals(StripeConnectStatus.Ready)
				},
			},
			"a user with customer permissions": {
				async "cannot pause the store"() {
					const {store} = await setups.linkedStore()
						.then(x => x.api.client(x.api.roles.customer))
						.then(x => x.browserTab())
					expect(store.get.connect.status).equals(StripeConnectStatus.Ready)
					await expect(async() => store.connect.pause()).throws()
					expect(store.get.connect.status).equals(StripeConnectStatus.Ready)
				},
				async "cannot resume the store"() {
					const {store} = await setups.linkedStore()
						.then(async x => {
							await x.merchant.store.connect.pause()
							return x.api.client(x.api.roles.customer)
						})
						.then(x => x.browserTab())
					expect(store.get.connect.status).equals(StripeConnectStatus.Paused)
					await expect(async() => store.connect.resume()).throws()
					expect(store.get.connect.status).equals(StripeConnectStatus.Paused)
				},
			},
		},
	},
	"subscription planning": {
		"a user with clerk permisisons": {
			async "can create a new subscription plan"() {
				const {store} = await setups.linkedStore()
					.then(x => x.api.client(x.api.roles.clerk))
					.then(x => x.browserTab())
				expect(store.get.subscriptions.plans.length).equals(0)
				const plan = await store.subscriptions.addPlan({
					planLabel: "premium membership",
					tier: {
						label: "supporter",
						pricing: {
							currency: "usd",
							interval: "month",
							price: 10_00,
						},
					},
				})
				expect(plan.planId).ok()
				expect(plan.tiers.length).equals(1)
				function expectPlanAndTierIsLocallyPresent() {
					const plans = store.get.subscriptions.plans
					expect(plans.length).equals(1)
					expect(plans[0]).ok()
					expect(plans[0].tiers.length).equals(1)
				}
				expectPlanAndTierIsLocallyPresent()
				await store.refresh()
				expectPlanAndTierIsLocallyPresent()
			},
			async "can create multiple plans, and the tiers aren't scrambled"() {
				const {store} = await setups.linkedStore()
					.then(x => x.api.client(x.api.roles.clerk))
					.then(x => x.browserTab())
				const getPlans = () => store.get.subscriptions.plans
				const getPlan = (id: string) => getPlans().find(p => p.planId === id)
				expect(getPlans().length).equals(0)
				const plan1 = await store.subscriptions.addPlan({
					planLabel: "video membership",
					tier: {
						label: "all videos",
						pricing: {
							currency: "usd",
							interval: "month",
							price: 10_00,
						},
					},
				})
				expect(getPlans().length).equals(1)
				expect(getPlan(plan1.planId)).ok()
				expect(getPlan(plan1.planId).tiers.length).equals(1)
				const plan2 = await store.subscriptions.addPlan({
					planLabel: "deluxe membership",
					tier: {
						label: "deluxe",
						pricing: {
							currency: "usd",
							interval: "month",
							price: 20_000,
						},
					},
				})
				function expectPlansAreLocallyPresent() {
					expect(getPlans().length).equals(2)
					expect(getPlan(plan2.planId)).ok()
					expect(getPlan(plan2.planId).tiers.length).equals(1)
					expect(getPlan(plan1.planId)).ok()
					expect(getPlan(plan1.planId).tiers.length).equals(1)
				}
				expectPlansAreLocallyPresent()
				await store.refresh()
				expectPlansAreLocallyPresent()
			},
			async "can view subscription plans made by other clerks"() {
				const {api} = await setups.linkedStore()
				{
					const {store} = await api.client(api.roles.clerk)
						.then(x => x.browserTab())
					await Promise.all([
						store.subscriptions.addPlan({
							planLabel: "premium membership",
							tier: {
								label: "supporter",
								pricing: {
									currency: "usd",
									interval: "month",
									price: 10_00,
								},
							},
						}),
						store.subscriptions.addPlan({
							planLabel: "underground secret society",
							tier: {
								label: "accolyte",
								pricing: {
									currency: "usd",
									interval: "month",
									price: 100_000,
								},
							},
						}),
					])
				}
				{
					const {store} = await api.client(api.roles.clerk)
						.then(x => x.browserTab())
					expect(store.get.subscriptions.plans.length).equals(2)
				}
			},
			async "can add a new tier to an existing plan"() {
				const {api} = await setups.linkedStore()
				const {store} = await api.client(api.roles.clerk)
					.then(x => x.browserTab())
				const {planId} = await store.subscriptions
					.addPlan({
						planLabel: "membership",
						tier: {
							label: "benevolent donor",
							pricing: {
								currency: "usd",
								interval: "month",
								price: 5_00,
							},
						},
					})
				const {tierId} = await store.subscriptions
					.addTier({
						planId,
						label: "deluxe",
						pricing: {
							currency: "usd",
							interval: "month",
							price: 10_000,
						},
					})
				const plans = store.get.subscriptions.plans
				const plan = plans.find(plan => plan.planId === planId)
				const tier = plan.tiers.find(tier => tier.tierId === tierId)
				expect(tier).ok()
				expect(tier.pricing.price).equals(10_000)
				{
					const {store} = await api.client(api.roles.clerk)
						.then(x => x.browserTab())
					const anotherPlans = store.get.subscriptions.plans
					const anotherPlan = anotherPlans
						.find(plan => plan.planId === planId)
					const anotherTier = anotherPlan.tiers
						.find(tier => tier.tierId === tierId)
					expect(anotherTier).ok()
					expect(anotherTier.pricing.price).equals(10_000)
				}
			},
			async "can edit a plan"() {
				const {store} = await setups.linkedStore()
					.then(x => x.api.client(x.api.roles.clerk))
					.then(x => x.browserTab())
				const plan = await store.subscriptions
					.addPlan({
						planLabel: "membership",
						tier: {
							label: "benevolent donor",
							pricing: {
								currency: "usd",
								interval: "month",
								price: 5_00,
							},
						},
					})
				function getPlan(planId: string) {
					const plans = store.get.subscriptions.plans
					return plans.find(plan => plan.planId === planId)
				}
				expect(getPlan(plan.planId).label).equals("membership")
				await store.subscriptions.editPlan({
					planId: plan.planId,
					archived: false,
					label: "premium",
				})
				expect(getPlan(plan.planId).label).equals("premium")
				await store.subscriptions.editPlan({
					planId: plan.planId,
					archived: true,
					label: "premium",
				})
				expect(getPlan(plan.planId).archived).equals(true)
			},
			async "can edit a tier"() {
				const {store} = await setups.linkedStore()
					.then(x => x.api.client(x.api.roles.clerk))
					.then(x => x.browserTab())
				const plan = await store.subscriptions
					.addPlan({
						planLabel: "membership",
						tier: {
							label: "benevolent donor",
							pricing: {
								currency: "usd",
								interval: "month",
								price: 5_00,
							},
						},
					})
				function getFirstTier() {
					const plans = store.get.subscriptions.plans
					const [plan] = plans
					const [tier] = plan.tiers
					return tier
				}
				const tier1 = getFirstTier()
				expect(tier1).ok()
				expect(tier1.active).equals(true)
				expect(tier1.label).equals("benevolent donor")
				expect(tier1.pricing.price).equals(5_00)

				await store.subscriptions.editTier({
					planId: plan.planId,
					tierId: tier1.tierId,
					active: tier1.active,
					label: "test",
					pricing: tier1.pricing,
				})
				const tier2 = getFirstTier()
				expect(tier2.label).equals("test")
				expect(tier2.active).equals(tier1.active)
				expect(tier2.pricing.price).equals(tier1.pricing.price)

				await store.subscriptions.editTier({
					planId: plan.planId,
					tierId: tier2.tierId,
					label: tier2.label,
					active: false,
					pricing: tier2.pricing,
				})
				const tier3 = getFirstTier()
				expect(tier3.active).equals(false)
				expect(tier3.label).equals(tier2.label)
				expect(tier3.pricing.price).equals(tier2.pricing.price)
			},
		},
		"a user with regular permissions": {
			async "can view subscription plans"() {},
			async "cannot create a new subscription plan"() {},
			async "cannot edit plans or tiers"() {},
		},
	},
	"billing": {
		"a user with regular permissions": {
			async "can add payment method"() {},
			async "can update payment method"() {},
			async "can delete payment method"() {},
		},
	},
	"subscription purchases": {
		"a user with regular permissions": {
			async "can purchase a subscription, with an existing payment method"() {},
			async "can purchase a subscription, while providing a new payment method"() {},
			async "can cancel and uncancel a subscription"() {},
			async "can upgrade a subscription to a higher tier"() {},
			async "can downgrade a subscription to a lower tier"() {},
		},
	},
	"interactions between billing + subscriptions": {
		"a user with regular permissions": {
			async "can update their payment method, for recurring billing on subscriptions"() {},
			async "can delete their payment method, ending recurring billing on subscriptions"() {},
			async "can add a payment method, reactivating recurring billing for subscriptions"() {},
		},
	},
}
