
import {expect} from "cynic"
import {suite} from "../../../../../types/suite.js"
import {SubscriptionStatus} from "../../../isomorphic/concepts.js"
import {storeWithSubscriptionPlans} from "../../utils/common-setups.js"

export default suite({
	async "can view subscription plans"() {
		const {api} = await storeWithSubscriptionPlans()
	
		const clerk
			= await api
			.client(api.roles.clerk)
			.then(x => x.browserTab())
	
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
		"a user with regular permissions": {
			async "can purchase a subscription, with an existing payment method"() {},
			async "can purchase a subscription, while providing a new payment method"() {},
			async "can cancel and uncancel a subscription"() {
				const {api, store} = await storeWithSubscriptionPlans()
				function getFirstTier() {
					const plans = store.get.subscriptions.plans
					const [plan] = plans
					const [tier] = plan.tiers
					return tier
				}
				const {tierId, pricing} = getFirstTier()
				const {stripePriceId} = pricing[0]
				console.log(stripePriceId)
				const customer
					= await api
					.client(api.roles.customer)
					.then(x => x.browserTab())

				await customer.store.subscriptions.purchase({stripePriceId})
				// await customer.store.refresh()
				// await customer.store.load()

				const subscription = customer.store.get
					.subscriptions
					.mySubscriptionDetails
					.find(subscription => subscription.tierId === tierId)

				expect(subscription.status).equals(SubscriptionStatus.Active)
				await customer.store.subscriptions.cancel(tierId)
				expect(subscription.status).equals(SubscriptionStatus.Cancelled)
				await customer.store.subscriptions.uncancel(tierId)
				expect(subscription.status).equals(SubscriptionStatus.Active)

			},
			async "can upgrade a subscription to a higher tier"() {},
			async "can downgrade a subscription to a lower tier"() {},
		},
	},
})

