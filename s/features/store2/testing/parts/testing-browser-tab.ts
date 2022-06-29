
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {mockStoreRig} from "./mock-rig.js"
import {TestSession} from "./test-session.js"
import {ops} from "../../../../framework/ops.js"
import {Await} from "../../../../types/await.js"
import {makeStoreApi} from "../../api/store-api.js"
import {makeStoreModel} from "../../models/store-model.js"
import {mockStorePopups} from "../../popups/mock-store-popups.js"
import {mockStripeCircuit} from "../../stripe/mock-stripe-circuit.js"

export const testingBrowserTab = ({
		appId,
		remote,
		circuit,
		session,
		generateId,
	}: {
		appId: string
		session: TestSession
		generateId: () => dbmage.Id
		circuit: Await<ReturnType<typeof mockStripeCircuit>>
		remote: renraku.ApiRemote<ReturnType<typeof makeStoreApi>>
	}) => async() => {

	async function login(newPrivileges: string[]) {
		session.privileges = newPrivileges
		session.access = {
			appId,
			origins: [],
			permit: {privileges: session.privileges},
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
		await store.updateAccessOp(ops.ready(session.access))
	}

	async function logout() {
		session.access = {
			appId,
			origins: [],
			permit: {privileges: []},
			scope: {core: true},
			user: undefined,
		}
		await store.updateAccessOp(ops.ready(session.access))
	}

	const rig = mockStoreRig()

	const store = makeStoreModel({
		services: {
			billing: remote.billingService,
			connect: remote.connectService,
			subscriptionObserver: remote.subscriptionObserverService,
			subscriptionPlanning: remote.subscriptionPlanningService,
			subscriptionShopping: remote.subscriptionShoppingService,
		},
		popups: mockStorePopups({
			rig,
			mockStripeOperations: circuit.mockStripeOperations,
		}),
		async reauthorize() {
			await logout()
			await login(session.privileges)
		},
	})

	await login(session.privileges)
	await store.initialize()

	return {
		store,
		rig,
		login,
		logout,
	}
}
