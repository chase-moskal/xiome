
import {Await} from "dbmage"
import * as dbmage from "dbmage"
import * as renraku from "renraku"

import {makeStoreApi} from "../../backend/api.js"
import {makeStoreModel} from "../../frontend/model/model.js"
import {ops} from "../../../../framework/ops.js"
import {mockStripeCircuit} from "../../backend/stripe/mock-stripe-circuit.js"
import {riggedStripePopups} from "../../popups/rigged-stripe-popups.js"

import {mockStoreRig} from "./mock-rig.js"
import {TestSession} from "./test-session.js"

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

	async function login(
			newPrivileges: string[],
			userId: string = generateId().string
		) {
		session.privileges = newPrivileges
		session.access = {
			appId,
			origins: [],
			permit: {privileges: session.privileges},
			scope: {core: true},
			user: {
				userId,
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
		services: remote,
		stripePopups: riggedStripePopups({
			rig,
			mockStripeOperations: circuit.mockStripeOperations,
		}),
		async reauthorize() {
			await login(
				session.privileges,
				session.access?.user?.userId
			)
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
