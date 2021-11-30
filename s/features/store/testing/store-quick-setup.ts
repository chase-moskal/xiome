
import {storeTestSetup} from "./store-test-setup.js"
import {storePrivileges} from "../store-privileges.js"

type StorePrivilegeKey = keyof typeof storePrivileges

export async function setupSimpleStoreClient(...privileges: StorePrivilegeKey[]) {
	const {makeClient} = await storeTestSetup()
	const client = await makeClient()
	await client.setAccessWithPrivileges(...privileges.map(p => storePrivileges[p]))
	return client
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
