
import {storeTestSetup} from "./store-test-setup.js"
import {makeStoreModel} from "../../frontend/model/model.js"

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

	const clerk =
		await api
			.client(api.roles.clerk)
			.then(x => x.browserTab())

	const {planId} =
		await clerk
			.store
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

	await clerk
		.store
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

	await clerk
		.store
		.subscriptions
		.addPlan({
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

	function getMySubscription(
			store: ReturnType<typeof makeStoreModel>,
			tierId: string
		) {
		return store.get
			.subscriptions
			.mySubscriptionDetails
			.find(subscription => subscription.tierId === tierId)
		}

	return {api, clerk, getMySubscription}
}
