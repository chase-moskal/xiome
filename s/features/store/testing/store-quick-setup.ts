
import {storeTestSetup} from "./store-test-setup.js"
import {storePrivileges} from "../store-privileges.js"
import {objectMap} from "../../../toolbox/object-map.js"
import {appPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"

const roleIds = objectMap(appPermissions.roles, role => <string>role.roleId)

function getRoleIds(...roles: (keyof typeof appPermissions.roles)[]) {
	return roles.map(role => appPermissions.roles[role].roleId)
}

export async function setupSimpleStoreClient(
		...roles: (keyof typeof appPermissions.roles)[]
	) {
	const {makeClient} = await storeTestSetup()
	return makeClient(...getRoleIds(...roles))
}

export async function setupLinkedStore() {
	const {makeClient, clerkRoleId} = await storeTestSetup()

	async function makeMerchantClient() {
		return makeClient(...getRoleIds("everybody", "admin"))
	}

	const merchantClient = await makeMerchantClient()
	await merchantClient.storeModel.initialize()
	await merchantClient.storeModel.connectSubmodel.connectStripeAccount()

	return {
		makeClient,
		merchantClient,
		makeAnotherMerchantClient: makeMerchantClient,
		async makeRegularClient() {
			const client = await makeClient(...getRoleIds("everybody"))
			await client.storeModel.initialize()
			return client
		},
		async makeClerkClient() {
			const client = await makeClient(clerkRoleId)
			await client.storeModel.initialize()
			return client
		},
	}
}

export async function setupStoreWithSubscriptionsSetup() {
	const store = await setupLinkedStore()
	const clerk = await store.makeClerkClient()
	const {subscriptionsSubmodel} = clerk.storeModel
	await clerk.storeModel.initialize()
	await subscriptionsSubmodel.addPlan({
		planLabel: "membership",
		tierLabel: "benevolent donor",
		tierPrice: 5_00,
	})
	return store
}
