
import {storeTestSetup} from "./store-test-setup.js"
import {storePrivileges} from "../permissions/store-privileges.js"

export async function simpleStoreSetup(...privileges: (keyof typeof storePrivileges)[]) {
	const {makeClient} = await storeTestSetup()
	const client = await makeClient()
	await client.setAccessWithPrivileges(...privileges.map(p => storePrivileges[p]))
	return client
}

export async function merchantStoreSetup() {
	const client = await simpleStoreSetup(
		"control store bank link",
		"manage store",
	)
	await client.storeModel.bank.linkStripeAccount()
	await client.storeModel.ecommerce.activate()
	await client.storeModel.ecommerce.enableStore()
	return client
}

export async function plebeianStoreSetup() {
	const {makeClient} = await storeTestSetup()
	{
		const merchant = await makeClient()
		await merchant.setAccessWithPrivileges(
			storePrivileges["control store bank link"],
			storePrivileges["manage store"],
		)
		await merchant.storeModel.bank.linkStripeAccount()
		await merchant.storeModel.ecommerce.activate()
		await merchant.storeModel.ecommerce.enableStore()
	}
	const plebeian = await makeClient()
	await plebeian.setAccessWithPrivileges()
	return plebeian
}
