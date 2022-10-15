
import {expect} from "cynic"

import {suite} from "../../../../types/suite.js"
import {connectedStore} from "../utils/common-setups.js"
import {storeTestSetup} from "../utils/store-test-setup.js"
import {StripeConnectStatus} from "../../isomorphic/concepts.js"

export default suite({
	"connect a stripe account": {
		"a user with merchant permissions": {
			async "can connect a stripe account"() {
				const {store} = await storeTestSetup()
					.then(x => x.api())
					.then(x => x.client(x.roles.merchant))
					.then(x => x.browserTab())
				expect(store.get.connect.details).not.ok()
				await store.connect.stripeAccountOnboarding()
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
				await store.connect.stripeAccountOnboarding()
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
				await merchant1.store.connect.stripeAccountOnboarding()
				const merchant2 = await api.client(api.roles.merchant)
					.then(x => x.browserTab())
				expect(merchant2.store.get.connect.details).ok()
			},
		},
		"a user with clerk permissions": {
			async "can see connect status, but not details"() {
				const {api} = await connectedStore()
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
				await expect(async() => store.connect.stripeAccountOnboarding())
					.throws()
			},
		},
		"a user with customer permissions": {
			async "cannot connect a stripe account"() {
				const {store} = await storeTestSetup()
					.then(x => x.api())
					.then(x => x.client(x.roles.customer))
					.then(x => x.browserTab())
				await expect(async() => store.connect.stripeAccountOnboarding())
					.throws()
			},
			async "can see connect status, but not details"() {
				const {api} = await connectedStore()
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
				const {store, rig} = await connectedStore()
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
				const {store} = await connectedStore()
					.then(x => x.api.client(x.api.roles.clerk))
					.then(x => x.browserTab())
				await expect(async() => store.connect.stripeLogin())
					.throws()
			},
		},
		"a user with customer permissions": {
			async "cannot login to stripe account"() {
				const {store} = await connectedStore()
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
				const {store} = await connectedStore()
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
				const {store} = await connectedStore()
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
				const {store} = await connectedStore()
					.then(x => x.api.client(x.api.roles.customer))
					.then(x => x.browserTab())
				expect(store.get.connect.status).equals(StripeConnectStatus.Ready)
				await expect(async() => store.connect.pause()).throws()
				expect(store.get.connect.status).equals(StripeConnectStatus.Ready)
			},
			async "cannot resume the store"() {
				const {store} = await connectedStore()
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
})
