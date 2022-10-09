
import {Await} from "dbmage"
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {makeStoreApi} from "../../backend/api.js"
import {makeTestSession} from "./test-session.js"
import {testingBrowserTab} from "./testing-browser-tab.js"
import {mockStripeCircuit} from "../../backend/stripe/mock-stripe-circuit.js"

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
			connect: getMeta,
			billing: getMeta,
			subscriptions: {
				listing: getMeta,
				planning: getMeta,
				shopping: getMeta,
			},
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
