
import * as dbmage from "dbmage"

import {makeStoreApi} from "../../backend/api.js"
import {testingClient} from "./testing-client.js"
import {StoreAuth} from "../../backend/policies/types.js"
import {storePrivileges} from "../../isomorphic/privileges.js"
import {AccessPayload} from "../../../auth/types/auth-tokens.js"
import {StoreDatabase} from "../../backend/database/types/schema.js"
import {mockStoreDatabaseRaw} from "../../backend/database/mock-raw.js"
import {DisabledLogger} from "../../../../toolbox/logger/disabled-logger.js"
import {mockStripeCircuit} from "../../backend/stripe/mock-stripe-circuit.js"
import {UnconstrainedTable} from "../../../../framework/api/unconstrained-table.js"
import {appPermissions} from "../../../../assembly/backend/permissions/standard-permissions.js"
import {makePrivilegeChecker} from "../../../auth/aspects/permissions/tools/make-privilege-checker.js"
import {buildFunctionToPrepareRoleManager, mockRoleManagerDatabaseRaw} from "../../../auth/aspects/permissions/interactions/role-manager.js"

export const storeTestSetup = async() => ({

	async api() {
		const rando = await dbmage.getRando()
		const generateId = () => rando.randomId()
		const appId = generateId()

		const tableStorage = dbmage.memoryFlexStorage()
		const storeDatabaseRaw = mockStoreDatabaseRaw()
		const permissionsDatabaseRaw = mockRoleManagerDatabaseRaw(tableStorage)
		const prepareRoleManager = buildFunctionToPrepareRoleManager({
			rando,
			permissionsDatabaseRaw,
		})

		const circuit = await mockStripeCircuit({
			rando,
			webRoot: "",
			tableStorage,
			storeDatabaseRaw,
			logger: new DisabledLogger(),
			prepareRoleManager,
		})

		const storeApi = makeStoreApi<AccessPayload>({
			popupReturnUrl: "fake-popup-return-url",
			stripeLiaison: circuit.stripeLiaison,
			generateId,
			anonPolicy: async(access) => (<StoreAuth>{
				access,
				stripeLiaison: circuit.stripeLiaison,
				roleManager: prepareRoleManager(appId),
				checker: makePrivilegeChecker(access.permit, appPermissions.privileges),
				storeDatabaseUnconnected: <StoreDatabase>UnconstrainedTable.constrainDatabaseForApp({
					appId: dbmage.Id.fromString(access.appId),
					database: storeDatabaseRaw,
				}),
			})
		})

		return {
			circuit,
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
