
import {storeTestSetup} from "./store-test-setup.js"

export async function connectedStore() {
	const api = await storeTestSetup()
		.then(x => x.api())

	const merchant = await api
		.client(api.roles.merchant)
		.then(x => x.browserTab())

	await merchant
		.store
		.connect
		.stripeAccountOnboarding()

	return {api, merchant}
}

export async function storeWithSubscriptionPlans() {
	const {api} = await connectedStore()
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

	await store.subscriptions
		.addTier({
			planId,
			label: "deluxe",
			pricing: {
				currency: "usd",
				interval: "month",
				price: 10_000,
			},
		})
	
	return {store, api}
}
