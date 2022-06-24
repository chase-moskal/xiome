import {getRando, memoryFlexStorage} from "dbmage"
import {DisabledLogger} from "../../../toolbox/logger/disabled-logger.js"
import {AccessPayload} from "../../auth/types/auth-tokens.js"
import {mockStoreDatabaseRaw} from "../api/mocks/mock-store-database-raw.js"
import {makeStoreApi} from "../api/store-api.js"
import {mockPermissionsInteractions} from "../interactions/mock-permissions-interactions.js"
import {storePrivileges} from "../store-privileges.js"
import {mockStripeCircuit} from "../stripe/mock-stripe-circuit.js"

export const storeTestSetup = async() => ({

	async api() {
		const rando = await getRando()
		const generateId = () => rando.randomId()
		const storeDatabaseRaw = mockStoreDatabaseRaw()
		const permissions = mockPermissionsInteractions({generateId})
		const circuit = await mockStripeCircuit({
			rando,
			storeDatabaseRaw,
			logger: new DisabledLogger(),
			tableStorage: memoryFlexStorage(),
		})
		const appId = generateId().string
		const storeApi = makeStoreApi({
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
			storePolicy: async(meta: AccessPayload) => ({
				access,
				permissionsInteractions: permissions.p
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
				function login(privileges: string[]) {
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
				}
				function logout() {
					access = {
						appId,
						origins: [],
						permit: {privileges: []},
						scope: {core: true},
						user: undefined,
					}
				}
				login(privileges)
				return {
					browserTab: async() => {
						return {
							store: undefined,//makeStoreModel(),
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
	},
})
