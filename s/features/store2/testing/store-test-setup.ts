
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {StoreAuth} from "../api/types.js"
import {makeStoreApi} from "../api/store-api.js"
import {storePrivileges} from "../store-privileges.js"
import {StoreDatabase} from "../types/store-schema.js"
import {makeStoreModel} from "../models/store-model.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {mockStorePopups} from "../popups/mock-store-popups.js"
import {mockStripeCircuit} from "../stripe/mock-stripe-circuit.js"
import {DisabledLogger} from "../../../toolbox/logger/disabled-logger.js"
import {mockStoreDatabaseRaw} from "../api/mocks/mock-store-database-raw.js"
import {UnconstrainedTable} from "../../../framework/api/unconstrained-table.js"
import {appPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"
import {mockPermissionsInteractions} from "../interactions/mock-permissions-interactions.js"
import {makePrivilegeChecker} from "../../auth/aspects/permissions/tools/make-privilege-checker.js"
import {ops} from "../../../framework/ops.js"

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
			accountReturningLinks: {
				refresh: "",
				return: "",
			},
			checkoutReturningLinks: {
				cancel: "",
				success: "",
			},
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
			client: async(privileges: string[]) => {
				let access: AccessPayload = undefined
				const getMeta = async() => access
				const remote = renraku.mock()
					.forApi(storeApi)
					.withMetaMap({
						connectService: getMeta,
						billingService: getMeta,
						subscriptionObserverService: getMeta,
						subscriptionPlanningService: getMeta,
						subscriptionShoppingService: getMeta,
					})
				return {
					browserTab: async() => {
						function login(newPrivileges: string[]) {
							privileges = newPrivileges
							access = {
								appId,
								origins: [],
								permit: {privileges},
								scope: {core: true},
								user: {
									userId: generateId().string,
									roles: [],
									stats: {joined: Date.now()},
									profile: {
										nickname: "Jimmy",
										tagline: "",
										avatar: {type: "simple", value: 1},
									},
								},
							}
							store.updateAccessOp(ops.ready(access))
						}
						function logout() {
							access = {
								appId,
								origins: [],
								permit: {privileges: []},
								scope: {core: true},
								user: undefined,
							}
							store.updateAccessOp(ops.ready(access))
						}
						const store = makeStoreModel({
							services: {
								billing: remote.billingService,
								connect: remote.connectService,
								subscriptionObserver: remote.subscriptionObserverService,
								subscriptionPlanning: remote.subscriptionPlanningService,
								subscriptionShopping: remote.subscriptionShoppingService,
							},
							popups: mockStorePopups({
								mockStripeOperations: circuit.mockStripeOperations,
							}),
							async reauthorize() {
								logout()
								login(privileges)
							},
						})
						login(privileges)
						await store.initialize()
						return {
							store,
							rig: {
								stripeLinkToFail() {},
							},
							login,
							logout,
						}
					},
				}
			},
		}
	}
})
