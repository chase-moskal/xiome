
import {ops} from "../../../../framework/ops.js"
import {StorePopups, StoreServices} from "../types.js"
import {StoreStateSystem} from "../state/store-state-system.js"
import {StripeConnectStatus} from "../../types/store-concepts.js"

export function makeConnectSubmodel({
		popups,
		services,
		stateSystem,
		reloadStore,
	}: {
		popups: StorePopups
		services: StoreServices
		stateSystem: StoreStateSystem
		reloadStore: () => Promise<void>
	}) {

	const state = stateSystem.snap.writable
	const {allowance} = stateSystem

	async function load() {
		state.stripeConnect.connectStatusOp = ops.none()
		state.stripeConnect.connectDetailsOp = ops.none()
		if (allowance.connectStripeAccount) {
			await ops.operation({
				promise: services.connect.loadConnectDetails(),
				setOp: op => {
					state.stripeConnect.connectStatusOp = ops.replaceValue(
						op,
						ops.value(op)?.connectStatus
					)
					state.stripeConnect.connectDetailsOp = ops.replaceValue(
						op,
						ops.value(op)?.connectDetails
					)
				},
			})
		}
		else {
			await ops.operation({
				promise: services.connect.loadConnectStatus(),
				setOp: op => state.stripeConnect.connectStatusOp = op,
			})
		}
	}

	return {
		load,

		async connectStripeAccount() {
			await popups.stripeConnect(
				await services.connect.generateConnectSetupLink()
			)
			await reloadStore()
		},
		async stripeLogin() {
			const connectStatus = ops.value(state.stripeConnect.connectStatusOp)
			const connectDetails = ops.value(state.stripeConnect.connectDetailsOp)
			if (connectStatus === StripeConnectStatus.Unlinked)
				throw new Error("no stripe account to generate login link for")
			if (!connectDetails)
				throw new Error("stripe connect details missing for login")
			const url = await services.connect.generateStripeLoginLink()
			const {stripeAccountId} = connectDetails
			await popups.stripeLogin({stripeAccountId, url})
		},
		async pause() {
			await services.connect.pause()
			state.stripeConnect.connectStatusOp = ops.ready(StripeConnectStatus.Paused)
			if (allowance.manageStore)
			state.stripeConnect.connectDetailsOp = ops.ready({
					...ops.value(state.stripeConnect.connectDetailsOp),
					paused: true,
				})
		},
		async resume() {
			await services.connect.resume()
			state.stripeConnect.connectStatusOp = ops.ready(StripeConnectStatus.Ready)
			if (allowance.manageStore)
				state.stripeConnect.connectDetailsOp = ops.ready({
					...ops.value(state.stripeConnect.connectDetailsOp),
					paused: false,
				})
		},
	}
}
