
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
import {makePrivilegeChecker} from "../../auth/aspects/permissions/tools/make-privilege-checker.js"
import {buildFunctionToPreparePermissionsInteractions, mockPermissionsDatabaseRaw} from "../interactions/permissions-interactions.js"

export const storeTestSetup = async() => ({

	async api() {
		const rando = await dbmage.getRando()
		const generateId = () => rando.randomId()
		const appId = generateId()

		const tableStorage = dbmage.memoryFlexStorage()
		const storeDatabaseRaw = mockStoreDatabaseRaw()
		const permissionsDatabaseRaw = mockPermissionsDatabaseRaw(tableStorage)
		const preparePermissionsInteractions = buildFunctionToPreparePermissionsInteractions({
			rando,
			permissionsDatabaseRaw,
		})

		const circuit = await mockStripeCircuit({
			rando,
			tableStorage,
			storeDatabaseRaw,
			logger: new DisabledLogger(),
			preparePermissionsInteractions,
		})

		const storeApi = makeStoreApi<AccessPayload>({
			popupReturnUrl: "fake-popup-return-url",
			stripeLiaison: circuit.stripeLiaison,
			generateId,
			storePolicy: async(access) => (<StoreAuth>{
				access,
				stripeLiaison: circuit.stripeLiaison,
				permissionsInteractions: preparePermissionsInteractions(appId),
				checker: makePrivilegeChecker(access.permit, appPermissions.privileges),
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
				appId: appId.string,
				circuit,
				storeApi,
				generateId,
			}),
		}
	}
})
