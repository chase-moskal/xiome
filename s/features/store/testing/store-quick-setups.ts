
import {storeTestSetup} from "./store-test-setup.js"
import {storePrivileges} from "../permissions/store-privileges.js"

export async function simpleStoreSetup(...privileges: (keyof typeof storePrivileges)[]) {
	const {makeClient} = await storeTestSetup()

	let bankLinkShouldSucceed = true
	const client = await makeClient({
		decideWhetherBankLinkageShouldSucceed: () => bankLinkShouldSucceed,
	})

	await client.setAccessWithPrivileges(...privileges.map(p => storePrivileges[p]))

	return {
		...client,
		setBankLinkToSucceed() {
			bankLinkShouldSucceed = true
		},
		setBankLinkToFail() {
			bankLinkShouldSucceed = false
		},
	}
}
