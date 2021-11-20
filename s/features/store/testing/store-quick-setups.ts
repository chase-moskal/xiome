
import {storeTestSetup} from "./store-test-setup.js"
import {storePrivileges} from "../permissions/store-privileges.js"

export async function simpleStoreSetup(...privileges: (keyof typeof storePrivileges)[]) {
	const {makeClient} = await storeTestSetup()
	const client = await makeClient()
	await client.setAccessWithPrivileges(...privileges.map(p => storePrivileges[p]))
	return client
}

