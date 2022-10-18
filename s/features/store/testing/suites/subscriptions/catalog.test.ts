
import {expect} from "cynic"
import {suite} from "../../../../../types/suite.js"
import {SubscriptionStatus} from "../../../isomorphic/concepts.js"
import {storeWithSubscriptionPlans} from "../../utils/common-setups.js"

export default suite({
	async "can view subscription plans"() {
		const {api, clerk} = await storeWithSubscriptionPlans()

		const customer
			= await api
			.client(api.roles.customer)
			.then(x => x.browserTab())

		const plansForCustomer = customer.store.get.subscriptions.plans
		expect(plansForCustomer.length).equals(1)

		const plansForClerk = clerk.store.get.subscriptions.plans
		expect(plansForClerk.length).equals(1)
	},
	
	"subscription purchases": {
		"a user with customer permissions": {
			async "can purchase a subscription, with an existing payment method"() {
				const {api} = await storeWithSubscriptionPlans()
				const customer
					= await api
					.client(api.roles.customer)
					.then(x => x.browserTab())

				expect(customer.store.get.billing.paymentMethod).not.ok()
				await customer.store.billing.customerPortal()
				expect(customer.store.get.billing.paymentMethod).ok()

				function getFirstTier() {
					return customer
						.store
						.get
						.subscriptions
						.plans[0]
						.tiers[0]
				}

				const {tierId, pricing} = getFirstTier()
				const {stripePriceId} = pricing[0]

				function getMySubscription() {
					return customer
						.store
						.get
						.subscriptions
						.mySubscriptionDetails
						.find(subscription => subscription.tierId === tierId)
				}

				await customer
					.store
					.subscriptions
					.purchase({stripePriceId})
				expect(getMySubscription().tierId).equals(tierId)
			},
			async "cannot purchase a subscription, with a failing payment method"() {
				const {api} = await storeWithSubscriptionPlans()
				const customer
					= await api
					.client(api.roles.customer)
					.then(x => x.browserTab())

				customer.rig.customerPortalAction = "link failing payment method"
				await customer.store.billing.customerPortal()

				function getFirstTier() {
					return customer
						.store
						.get
						.subscriptions
						.plans[0]
						.tiers[0]
				}

				const {tierId, pricing} = getFirstTier()
				const {stripePriceId} = pricing[0]

				function getMySubscription() {
					return customer
						.store
						.get
						.subscriptions
						.mySubscriptionDetails
						.find(subscription => subscription.tierId === tierId)
				}

				await customer
					.store
					.subscriptions
					.purchase({stripePriceId})

				expect(getMySubscription().status).equals(SubscriptionStatus.Unpaid)
			},
			async "can cancel and uncancel a subscription"() {
				const {api} = await storeWithSubscriptionPlans()

				const customer =
					await api
						.client(api.roles.customer)
						.then(x => x.browserTab())

				function getFirstTier() {
					return customer
						.store
						.get
						.subscriptions
						.plans[0]
						.tiers[0]
				}

				const {tierId, pricing} = getFirstTier()
				const {stripePriceId} = pricing[0]

				function getMySubscription() {
					return customer
						.store
						.get
						.subscriptions
						.mySubscriptionDetails
						.find(subscription => subscription.tierId === tierId)
				}

				await customer
					.store
					.subscriptions
					.purchase({stripePriceId})

				expect(getMySubscription().status).equals(SubscriptionStatus.Active)

				await customer.store.subscriptions.cancel(tierId)
				expect(getMySubscription().status).equals(SubscriptionStatus.Cancelled)

				await customer.store.subscriptions.uncancel(tierId)
				expect(getMySubscription().status).equals(SubscriptionStatus.Active)
			},
			async "can upgrade a subscription to a higher tier"() {
				const {api} = await storeWithSubscriptionPlans()

				const customer =
					await api
						.client(api.roles.customer)
						.then(x => x.browserTab())

				function getTierAtIndex(index: number) {
					return customer
						.store
						.get
						.subscriptions
						.plans[0]
						.tiers[index]
				}

				function getMySubscription(tierId: string) {
					return customer
						.store
						.get
						.subscriptions
						.mySubscriptionDetails
						.find(subscription => subscription.tierId === tierId)
				}

				const tier1 = getTierAtIndex(0)
				const stripePriceId1 = tier1.pricing[0].stripePriceId

				await customer
					.store
					.subscriptions
					.purchase({stripePriceId: stripePriceId1})

				expect(getMySubscription(tier1.tierId).tierId).equals(tier1.tierId)

				const tier2 = getTierAtIndex(1)
				const stripePriceId2 = tier2.pricing[0].stripePriceId

				await customer
					.store
					.subscriptions
					.purchase({stripePriceId: stripePriceId2})

				expect(getMySubscription(tier2.tierId).tierId).equals(tier2.tierId)
			},
			async "can downgrade a subscription to a lower tier"() {
				const {api} = await storeWithSubscriptionPlans()

				const customer =
					await api
						.client(api.roles.customer)
						.then(x => x.browserTab())

				function getTierAtIndex(index: number) {
					return customer
						.store
						.get
						.subscriptions
						.plans[0]
						.tiers[index]
				}

				function getMySubscription(tierId: string) {
					return customer
						.store
						.get
						.subscriptions
						.mySubscriptionDetails
						.find(subscription => subscription.tierId === tierId)
				}

				const tier2 = getTierAtIndex(1)
				const stripePriceId2 = tier2.pricing[0].stripePriceId

				await customer
					.store
					.subscriptions
					.purchase({stripePriceId: stripePriceId2})

				expect(getMySubscription(tier2.tierId).tierId).equals(tier2.tierId)

				const tier1 = getTierAtIndex(0)
				const stripePriceId1 = tier1.pricing[0].stripePriceId

				await customer
					.store
					.subscriptions
					.purchase({stripePriceId: stripePriceId1})

				expect(getMySubscription(tier1.tierId).tierId).equals(tier1.tierId)
			},
			async "can purchase multiple subscriptions for different plans"() {
				const {api, clerk} = await storeWithSubscriptionPlans()
				await clerk
					.store.subscriptions.addPlan({
						planLabel: "bees",
						tier: {
							label: "worker bee",
							pricing: {
								currency: "usd",
								interval: "month",
								price: 4_00,
							},
						},
					})

				const customer
					= await api
						.client(api.roles.customer)
						.then(x => x.browserTab())

				const tier1 = customer.store.get.subscriptions.plans[0].tiers[0]
				const tier2 = customer.store.get.subscriptions.plans[1].tiers[0]

				const stripePriceId1 = tier1.pricing[0].stripePriceId
				const stripePriceId2 = tier2.pricing[0].stripePriceId

				await customer.store.subscriptions.purchase({
					stripePriceId: stripePriceId1
				})
				await customer.store.subscriptions.purchase({
					stripePriceId: stripePriceId2
				})

				const subscriptionDetails 
					= customer
						.store
						.get
						.subscriptions
						.mySubscriptionDetails

				const planIds 
					= subscriptionDetails
						.map(subscription => subscription.planId)
				
				expect(planIds.length).equals(2)
				expect(planIds[0]).not.equals(planIds[1])
			},
		},
	},
})
