
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
			"a user with regular permissions": {
				async "cannot pause or resume the store"() {
					{
						const {store} = await setups.linkedStore()
							.then(x => x.api.client(x.api.roles.clerk))
							.then(x => x.browserTab())
						expect(store.get.connect.status).equals(StripeConnectStatus.Ready)
						expect(async() => store.connect.pause()).throws()
						expect(store.get.connect.status).equals(StripeConnectStatus.Ready)
					}
					{
						const {store} = await setups.linkedStore()
							.then(async x => {
								await x.merchant.store.connect.pause()
								return x.api.client(x.api.roles.clerk)
							})
							.then(x => x.browserTab())
						expect(store.get.connect.status).equals(StripeConnectStatus.Paused)
						expect(async() => store.connect.resume()).throws()
						expect(store.get.connect.status).equals(StripeConnectStatus.Paused)
					}
				},
			},
		},
	},
	"subscription planning": {
		"a user with clerk permisisons": {
			async "can create a new subscription plan"() {},
			async "can create multiple plans, and the tiers aren't scrambled"() {},
			async "can view subscription plans made by other clerks"() {},
			async "can add a new tier to an existing plan"() {},
			async "can edit a plan"() {},
			async "can edit a tier"() {},
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
