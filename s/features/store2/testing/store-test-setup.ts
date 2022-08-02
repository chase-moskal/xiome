
import * as dbmage from "dbmage"

import {StoreAuth} from "../api/types.js"
import {makeStoreApi} from "../api/store-api.js"
import {storePrivileges} from "../store-privileges.js"
import {StoreDatabase} from "../types/store-schema.js"
import {testingClient} from "./parts/testing-client.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {mockStripeCircuit} from "../stripe/mock-stripe-circuit.js"
import {DisabledLogger} from "../../../toolbox/logger/disabled-logger.js"
import {mockStoreDatabaseRaw} from "../api/mocks/mock-store-database-raw.js"
import {UnconstrainedTable} from "../../../framework/api/unconstrained-table.js"
import {appPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"
import {mockPermissionsInteractions} from "../interactions/mock-permissions-interactions.js"
import {makePrivilegeChecker} from "../../auth/aspects/permissions/tools/make-privilege-checker.js"

export const storeTestSetup = async() => ({

	async api() {
		const rando = await dbmage.getRando()
		const generateId = () => rando.randomId()
		const storeDatabaseRaw = mockStoreDatabaseRaw()
		const permissions = mockPermissionsInteractions({generateId})

		const circuit = await mockStripeCircuit({
			rando,
			storeDatabaseRaw,
			logger: new DisabledLogger(),
			tableStorage: dbmage.memoryFlexStorage(),
		})

		const appId = generateId().string

		const storeApi = makeStoreApi<AccessPayload>({
			popupReturnUrl: "fake-popup-return-url",
			stripeLiaison: circuit.stripeLiaison,
			generateId,
			storePolicy: async(access) => (<StoreAuth>{
				access,
				checker: makePrivilegeChecker(access.permit, appPermissions.privileges),
				stripeLiaison: circuit.stripeLiaison,
				permissionsInteractions: permissions.permissionsInteractions,
				storeDatabase: <StoreDatabase>UnconstrainedTable.constrainDatabaseForApp({
					appId: dbmage.Id.fromString(access.appId),
					database: storeDatabaseRaw,
				}),
			})
		})

		return {
			roles: {
				merchant: [
					storePrivileges["control stripe account"],
					storePrivileges["manage store"],
					storePrivileges["give away freebies"],
				],
				clerk: [
					storePrivileges["manage store"],
					storePrivileges["give away freebies"],
				],
				customer: [],
			},
			client: testingClient({
				appId,
				circuit,
				storeApi,
				generateId,
			}),
		}
	}
})
