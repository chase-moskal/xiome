import {getRando, memoryFlexStorage} from "dbmage"
import {DisabledLogger} from "../../../toolbox/logger/disabled-logger.js"
import {mockStoreDatabaseRaw} from "../api/mocks/mock-store-database-raw.js"
import {makeStoreApi} from "../api/store-api.js"
import {mockPermissionsInteractions} from "../interactions/mock-permissions-interactions.js"
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
		const storeApi = makeStoreApi({
			accountReturningLinks: {
				refresh: "",
				return: "",
			},
			checkoutReturningLinks: {
				cancel: "",
				success: "",
			},
			config: <any>{},
			stripeLiaison: circuit.stripeLiaison,
			generateId,
			anonPolicy: async(meta) => (<any>{
				// access: {
				// 	appId: generateId(),
				// 	origins: [],
				// 	permit: {
				// 		privileges: [],
				// 	},
				// 	scope: {core: true},
				// 	user: {
				// 		userId: 
				// 	},
				// },
				// checker: {},
				// database: {},
			}),
		})
		return {
			roles: {
				merchant: {},
			},
			client: async(role: any) => ({
				browserTab: async() => {
					return {
						store: undefined,//makeStoreModel(),
						rig: {
							stripeLinkToFail() {},
						},
						access: {
							async logout() {},
						},
					}
				},
			}),
		}
	},
})
