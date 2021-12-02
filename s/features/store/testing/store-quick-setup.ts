
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
	await merchantClient.storeModel.connectSubmodel.activate()
	await merchantClient.storeModel.connectSubmodel.connectStripeAccount()

	return {
		makeClient,
		merchantClient,
		makeAnotherMerchantClient: makeMerchantClient,
		async makePlebeianClient() {
			const client = await makeClient()
			await client.setAccessWithPrivileges()
			await client.storeModel.connectSubmodel.activate()
			return client
		},
		async makeClerkClient() {
			const client = await makeClient()
			await client.setAccessWithPrivileges(
				storePrivileges["manage store"],
				storePrivileges["give away freebies"],
			)
			await client.storeModel.connectSubmodel.activate()
			return client
		},
	}
}

// export async function merchantStoreSetup() {
// 	const client = await simpleStoreSetup(
// 		"connect stripe account",
// 		"manage store",
// 	)
// 	await client.storeModel.bank.linkStripeAccount()
// 	await client.storeModel.ecommerce.activate()
// 	await client.storeModel.ecommerce.enableStore()
// 	return client
// }

// export async function plebeianStoreSetup() {
// 	const {makeClient} = await storeTestSetup()
// 	{
// 		const merchant = await makeClient()
// 		await merchant.setAccessWithPrivileges(
// 			storePrivileges["connect stripe account"],
// 			storePrivileges["manage store"],
// 		)
// 		await merchant.storeModel.bank.linkStripeAccount()
// 		await merchant.storeModel.ecommerce.activate()
// 		await merchant.storeModel.ecommerce.enableStore()
// 	}
// 	const plebeian = await makeClient()
// 	await plebeian.setAccessWithPrivileges()
// 	return plebeian
// }

// export async function interestingStoreSetup() {
// 	const {makeClient} = await storeTestSetup()

// 	const merchant = await makeClient()
// 	await merchant.setAccessWithPrivileges(
// 		storePrivileges["connect stripe account"],
// 		storePrivileges["manage store"],
// 	)
// 	await merchant.storeModel.bank.linkStripeAccount()
// 	await merchant.storeModel.ecommerce.activate()
// 	await merchant.storeModel.ecommerce.enableStore()

// 	const plebeian = await makeClient()
// 	await plebeian.setAccessWithPrivileges()

// 	return {merchant, plebeian}
// }
