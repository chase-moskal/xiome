
import {expect} from "cynic"
import {suite} from "../../../../../types/suite.js"
import {SubscriptionStatus} from "../../../isomorphic/concepts.js"
import {storeWithSubscriptionPlans} from "../../utils/common-setups.js"

export default suite({
	async "merchants, clerks and customers can view subscription plans"() {
		const {api} = await storeWithSubscriptionPlans()
		const {merchant, clerk, customer} = api.roles

		for (const role of [merchant, clerk, customer]) {
			const {store} = await api
				.client(role)
				.then(x => x.browserTab())

			const plans = store.get.subscriptions.plans
			expect(plans.length).equals(2)
		}
	},

	async "logged-out user can view subscription plans"() {
		const {api} = await storeWithSubscriptionPlans()
		const {store, logout} = await api
			.client(api.roles.customer)
			.then(x => x.browserTab())
		await logout()
		expect(store.get.subscriptions.plans.length)
			.equals(2)
	},

	"subscription purchases x": {
		async "merchants, clerks and customers can purchase a subscription with an existing payment method"() {
			const {api, getMySubscription} = await storeWithSubscriptionPlans()
			const {merchant, clerk, customer} = api.roles

			for (const role of [merchant, clerk, customer]) {
				const {store} = await api
					.client(role)
					.then(x => x.browserTab())

				expect(store.get.billing.paymentMethod).not.ok()
				await store.billing.customerPortal()
				expect(store.get.billing.paymentMethod).ok()

				const {tierId, pricing} 
					= store.get.subscriptions.plans[0].tiers[0]
				const {stripePriceId} = pricing[0]

				await store
					.subscriptions
					.purchase({stripePriceId})

				expect(getMySubscription(store, tierId).tierId).equals(tierId)
			}
		},
	
		async "merchants, clerks and customers cannot purchase a subscription with a failing payment method"() {
			const {api, getMySubscription} = await storeWithSubscriptionPlans()
			const {merchant, clerk, customer} = api.roles

			for (const role of [merchant, clerk, customer]) {
				const {store, rig} = await api
					.client(role)
					.then(x => x.browserTab())

				rig.customerPortalAction = "link failing payment method"
				await store.billing.customerPortal()

				const {tierId, pricing} 
					= store.get.subscriptions.plans[0].tiers[0]
				const {stripePriceId} = pricing[0]

				await store
					.subscriptions
					.purchase({stripePriceId})

				expect(getMySubscription(store, tierId).status).equals(SubscriptionStatus.Unpaid)
			}
		},

		async "merchants, clerks and customers can purchase multiple subscriptions for different plans"() {
			const {api} = await storeWithSubscriptionPlans()
			const {merchant, clerk, customer} = api.roles

			for (const role of [merchant, clerk, customer]) {
				const {store} = await api
					.client(role)
					.then(x => x.browserTab())

				const tier1 = store.get.subscriptions.plans[0].tiers[0]
				const tier2 = store.get.subscriptions.plans[1].tiers[0]

				const stripePriceId1 = tier1.pricing[0].stripePriceId
				const stripePriceId2 = tier2.pricing[0].stripePriceId

				await store.subscriptions.purchase({
					stripePriceId: stripePriceId1
				})
				await store.subscriptions.purchase({
					stripePriceId: stripePriceId2
				})

				const subscriptionDetails 
					= store.get
						.subscriptions
						.mySubscriptionDetails

				const planIds 
					= subscriptionDetails
						.map(subscription => subscription.planId)
				
				expect(planIds.length).equals(2)
				expect(planIds[0]).not.equals(planIds[1])
			}
		},

		async "merchants, clerks and customers can cancel and uncancel a subscription"() {
			const {api, getMySubscription} = await storeWithSubscriptionPlans()
			const {merchant, clerk, customer} = api.roles

			for (const role of [merchant, clerk, customer]) {
				const {store} = await api
					.client(role)
					.then(x => x.browserTab())

				const tier1 = store.get.subscriptions.plans[0].tiers[0]
				const stripePriceId1 = tier1.pricing[0].stripePriceId
				await store
					.subscriptions
					.purchase({stripePriceId: stripePriceId1})
				expect(getMySubscription(store, tier1.tierId).tierId).equals(tier1.tierId)

				const tier2 = store.get.subscriptions.plans[0].tiers[1]
				const stripePriceId2 = tier2.pricing[0].stripePriceId
				await store
					.subscriptions
					.purchase({stripePriceId: stripePriceId2})
				expect(getMySubscription(store, tier2.tierId).tierId).equals(tier2.tierId)
			}
		},

		async "merchants, clerks and customers can upgrade and downgrade a subscription"() {
			const {api, getMySubscription} = await storeWithSubscriptionPlans()
			const {merchant, clerk, customer} = api.roles

			for (const role of [merchant, clerk, customer]) {
				const {store} = await api
					.client(role)
					.then(x => x.browserTab())

				const plan = store.get.subscriptions.plans[0]
				const tier1 = plan.tiers[0]
				const tier2 = plan.tiers[1]

				const stripePriceId1 = tier1.pricing[0].stripePriceId
				const stripePriceId2 = tier2.pricing[0].stripePriceId

				await store
					.subscriptions
					.purchase({stripePriceId: stripePriceId1})

				const upgrade = async() => await store
					.subscriptions
					.purchase({stripePriceId: stripePriceId2})

				const downgrade = async() => await store
					.subscriptions
					.purchase({stripePriceId: stripePriceId1})

				expect(getMySubscription(store, tier1.tierId).tierId).equals(tier1.tierId)
				await upgrade()
				expect(getMySubscription(store, tier2.tierId).tierId).equals(tier2.tierId)
				await downgrade()
				expect(getMySubscription(store, tier1.tierId).tierId).equals(tier1.tierId)
			}
		},
	},

})
