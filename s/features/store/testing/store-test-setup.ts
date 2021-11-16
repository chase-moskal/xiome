
import {mockRemote} from "renraku/x/remote/mock-remote.js"
import {mockHttpRequest} from "renraku/x/remote/mock-http-request.js"

import {storeApi} from "../api/store-api.js"
import {makeStoreModel} from "../model/store-model.js"
import {mockMeta} from "../../../common/testing/mock-meta.js"
import {mockAccess} from "../../../common/testing/mock-access.js"
import {mockStoreTables} from "../api/tables/mock-store-tables.js"
import {mockAuthTables} from "../../auth/tables/mock-auth-tables.js"
import {mockStripeCircuit} from "../stripe2/mocks/mock-stripe-circuit.js"
import {prepareMockAuth} from "../../../common/testing/prepare-mock-auth.js"
import {appPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"
import {UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"

export async function storeTestSetup() {
	const {appId, rando, config, storage, appOrigin, authPolicies}
		= await prepareMockAuth()

	const stripeAccountId = rando.randomId().toString()
	const authTables = new UnconstrainedTables(await mockAuthTables(storage))
	const storeTables = new UnconstrainedTables(await mockStoreTables(storage))

	const {stripeComplex, mockStripeOperations} = await mockStripeCircuit({
		rando,
		authTables,
		storeTables,
		tableStorage: storage,
	})

	const api = storeApi({
		config,
		storeTables,
		authPolicies,
		stripeComplex,
		accountReturningLinks: {
			refresh: "https://api.xiome.io/store/stripe?x=refresh",
			return: "https://api.xiome.io/store/stripe?x=return",
		},
		checkoutReturningLinks: {
			cancel: "https://api.xiome.io/store/stripe?x=cancel",
			success: "https://api.xiome.io/store/stripe?x=success",
		},
		generateId: () => rando.randomId(),
	})

	return {
		api,
		stripeComplex,
		mockStripeOperations,
		async makeClient(withPrivileges: string[] = []) {
			const access = mockAccess({
				rando,
				appId,
				appOrigin,
				privileges: [
					appPermissions.privileges["universal"],
					...withPrivileges,
				]
			})
			const meta = {
				meta: await mockMeta({access}),
				request: mockHttpRequest({origin: appOrigin}),
			}
			const remotes = {
				shopkeepingService: mockRemote(api.shopkeepingService).withMeta(meta),
				statusCheckerService: mockRemote(api.statusCheckerService).withMeta(meta),
				statusTogglerService: mockRemote(api.statusTogglerService).withMeta(meta),
				stripeConnectService: mockRemote(api.stripeConnectService).withMeta(meta),
			}

			const storeModel = makeStoreModel({
				storage,
				appId: appId.toString(),
				shopkeepingService: remotes.shopkeepingService,
				statusCheckerService: remotes.statusCheckerService,
				statusTogglerService: remotes.statusTogglerService,
				stripeAccountsService: remotes.stripeConnectService,
				triggerBankPopup: async() => {
					await mockStripeOperations
						.linkBankWithExistingStripeAccount(stripeAccountId)
				},
			})

			return {storeModel}
		},
	}
}
