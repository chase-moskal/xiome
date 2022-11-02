
import {expect} from "cynic"

import {suite} from "../../../../../types/suite.js"
import {connectedStore} from "../../utils/common-setups.js"
import {SubscriptionPricing} from "../../../isomorphic/concepts.js"
import {SubscriptionPricingDraft} from "../../../backend/services/subscriptions/types/drafts.js"

export default suite({
	"a user with clerk permisisons": {

		async "can create a new subscription plan"() {
			const {store} = await connectedStore()
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
				expect(plans[0].tiers[0]).ok()
				expect(plans[0].tiers[0].pricing).ok()
				expect(plans[0].tiers[0].pricing.length).equals(1)
				expect(plans[0].tiers[0].pricing[0]).ok()
				expect(plans[0].tiers[0].pricing[0].price).equals(10_00)
			}

			expectPlanAndTierIsLocallyPresent()
			await store.refresh()
			expectPlanAndTierIsLocallyPresent()
		},

		async "can create multiple plans, and the tiers aren't scrambled"() {
			const {store} = await connectedStore()
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
			const {api} = await connectedStore()
			{
				const {store}
					= await api
					.client(api.roles.clerk)
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
				const {store}
					= await api
					.client(api.roles.clerk)
					.then(x => x.browserTab())

				expect(store.get.subscriptions.plans.length)
					.equals(2)
			}
		},

		async "can add a new tier to an existing plan"() {
			const {api} = await connectedStore()
			const {store}
				= await api
				.client(api.roles.clerk)
				.then(x => x.browserTab())

			const {planId}
				= await store
				.subscriptions
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

			const {tierId}
				= await store
				.subscriptions
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
			expect(tier.pricing[0].price).equals(10_000)

			{
				const {store}
					= await api
					.client(api.roles.clerk)
					.then(x => x.browserTab())

				const anotherPlans = store.get.subscriptions.plans

				const anotherPlan = anotherPlans
					.find(plan => plan.planId === planId)

				const anotherTier = anotherPlan.tiers
					.find(tier => tier.tierId === tierId)

				expect(anotherTier).ok()
				expect(anotherTier.pricing[0].price).equals(10_000)
			}
		},

		async "can edit a plan"() {
			const {store}
				= await connectedStore()
				.then(x => x.api.client(x.api.roles.clerk))
				.then(x => x.browserTab())

			const plan
				= await store
				.subscriptions
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

			expect(getPlan(plan.planId).label)
				.equals("membership")

			await store.subscriptions.editPlan({
				planId: plan.planId,
				archived: false,
				label: "premium",
			})

			expect(getPlan(plan.planId).label)
				.equals("premium")

			await store.subscriptions.editPlan({
				planId: plan.planId,
				archived: true,
				label: "premium",
			})

			expect(getPlan(plan.planId).archived)
				.equals(true)
		},

		async "can edit a tier"() {
			const {store} = await connectedStore()
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
			expect(tier1.pricing[0].price).equals(5_00)
			function pricingToDraft(pricing: SubscriptionPricing): SubscriptionPricingDraft {
				return {
					price: pricing.price,
					currency: pricing.currency,
					interval: pricing.interval,
				}
			}
			await store.subscriptions.editTier({
				planId: plan.planId,
				tierId: tier1.tierId,
				active: tier1.active,
				label: "test",
				pricing: pricingToDraft(tier1.pricing[0]),
			})
			await store.subscriptions.load()
			const tier2 = getFirstTier()
			expect(tier2.label).equals("test")
			expect(tier2.active).equals(tier1.active)
			expect(tier2.pricing[0].price).equals(tier1.pricing[0].price)
			await store.subscriptions.editTier({
				planId: plan.planId,
				tierId: tier2.tierId,
				label: tier2.label,
				active: false,
				pricing: pricingToDraft(tier2.pricing[0]),
			})
			const tier3 = getFirstTier()
			expect(tier3.active).equals(false)
			expect(tier3.label).equals(tier2.label)
			expect(tier3.pricing[0].price).equals(tier2.pricing[0].price)
		},

	},
	"a user with regular permissions": {

		async "cannot create a new subscription plan"() {
			const customer
				= await connectedStore()
				.then(x => x.api.client(x.api.roles.customer))
				.then(x => x.browserTab())

			async function customerAddsPlan() {
				await customer.store.subscriptions.addPlan({
					planLabel: "membership plan",
					tier: {
						label: "premium tier",
						pricing: {
							currency: "usd",
							interval: "month",
							price: 9_00,
						},
					},
				})
			}

			await expect(customerAddsPlan).throws()
		},

		async "cannot edit plans or tiers"() {},

	},
})
