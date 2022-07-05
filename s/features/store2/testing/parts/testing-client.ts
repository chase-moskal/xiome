
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {Await} from "../../../../types/await.js"
import {makeTestSession} from "./test-session.js"
import {makeStoreApi} from "../../api/store-api.js"
import {testingBrowserTab} from "./testing-browser-tab.js"
import {mockStripeCircuit} from "../../stripe/mock-stripe-circuit.js"

export const testingClient = ({
		appId,
		circuit,
		storeApi,
		generateId,
	}: {
		appId: string
		generateId: () => dbmage.Id
		storeApi: ReturnType<typeof makeStoreApi>
		circuit: Await<ReturnType<typeof mockStripeCircuit>>
	}) => async(privileges: string[]) => {

	const session = makeTestSession()
	session.access = undefined
	session.privileges = privileges

	const getMeta = async() => session.access

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
		browserTab: testingBrowserTab({
			appId,
			remote,
			circuit,
			session,
			generateId,
		}),
	}
}