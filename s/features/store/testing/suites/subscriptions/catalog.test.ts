
import {expect} from "cynic"
import {suite} from "../../../../../types/suite.js"
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
			async "can cancel and uncancel a subscription"() {},
			async "can upgrade a subscription to a higher tier"() {},
			async "can downgrade a subscription to a lower tier"() {},
		},
	},
})

