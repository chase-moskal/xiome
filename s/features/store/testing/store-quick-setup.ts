
import {storeTestSetup} from "./store-test-setup.js"
import {storePowerPrivileges, storePrivileges} from "../store-privileges.js"

type StorePrivilegeKey = keyof typeof storePrivileges

export async function setupSimpleStoreClient(...privileges: StorePrivilegeKey[]) {
	const {makeClient} = await storeTestSetup()
	const client = await makeClient()
	await client.setAccessWithPrivileges(...privileges.map(p => storePrivileges[p]))
	return client
}

export async function setupLinkedStore() {
	const {makeClient} = await storeTestSetup()

	async function makeMerchantClient() {
		const merchantClient = await makeClient()
		await merchantClient.setAccessWithPrivileges(
			...Object.values(storePowerPrivileges)
		)
		return merchantClient
	}

	const merchantClient = await makeMerchantClient()
	await merchantClient.storeModel.connectSubmodel.initialize()
	await merchantClient.storeModel.connectSubmodel.connectStripeAccount()

	return {
		makeClient,
		merchantClient,
		makeAnotherMerchantClient: makeMerchantClient,
		async makeRegularClient() {
			const client = await makeClient()
			await client.setAccessWithPrivileges()
			await client.storeModel.connectSubmodel.initialize()
			return client
		},
		async makeClerkClient() {
			const client = await makeClient()
			await client.setAccessWithPrivileges(
				storePrivileges["manage store"],
				storePrivileges["give away freebies"],
			)
			await client.storeModel.connectSubmodel.initialize()
			return client
		},
	}
}

export async function setupStoreWithSubscriptionsSetup() {
	const store = await setupLinkedStore()
	const clerk = await store.makeClerkClient()
	const {subscriptionsSubmodel: planning} = clerk.storeModel
	planning.initialize()
	await planning.addPlan({
		planLabel: "membership",
		tierLabel: "benevolent donor",
		tierPrice: 5_00,
	})
	return store
}
