
import {ops} from "../../../../framework/ops.js"
import {StorePopups, StoreServices} from "../types.js"
import {makeStoreState} from "../state/store-state.js"
import {StripeConnectStatus} from "../../types/store-concepts.js"
import {makeStoreAllowance} from "../utils/make-store-allowance.js"

export function makeConnectSubmodel({
		snap,
		allowance,
		services,
		popups,
		reloadEverythingInTheStore,
	}: {
		snap: ReturnType<typeof makeStoreState>
		allowance: ReturnType<typeof makeStoreAllowance>
		services: StoreServices
		popups: StorePopups
		reloadEverythingInTheStore: () => Promise<void>
	}) {

	async function load() {
		snap.state.stripeConnect.connectStatusOp = ops.none()
		snap.state.stripeConnect.connectDetailsOp = ops.none()
		if (allowance.connectStripeAccount) {
			await ops.operation({
				promise: services.connect.loadConnectDetails(),
				setOp: op => {
					snap.state.stripeConnect.connectStatusOp = ops.replaceValue(
						op,
						ops.value(op)?.connectStatus
					)
					snap.state.stripeConnect.connectDetailsOp = ops.replaceValue(
						op,
						ops.value(op)?.connectDetails
					)
				},
			})
		}
		else {
			await ops.operation({
				promise: services.connect.loadConnectStatus(),
				setOp: op => snap.state.stripeConnect.connectStatusOp = op,
			})
		}
	}

	return {
		load,

		async connectStripeAccount() {
			await popups.stripeConnect(
				await services.connect.generateConnectSetupLink()
			)
			await reloadEverythingInTheStore()
		},
		async stripeLogin() {
			const connectStatus = ops.value(snap.readable.stripeConnect.connectStatusOp)
			const connectDetails = ops.value(snap.state.stripeConnect.connectDetailsOp)
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
			snap.writable.stripeConnect.connectStatusOp = ops.ready(StripeConnectStatus.Paused)
			if (allowance.manageStore)
				snap.writable.stripeConnect.connectDetailsOp = ops.ready({
					...ops.value(snap.readable.stripeConnect.connectDetailsOp),
					paused: true,
				})
		},
		async resume() {
			await services.connect.resume()
			snap.writable.stripeConnect.connectStatusOp = ops.ready(StripeConnectStatus.Ready)
			if (allowance.manageStore)
				snap.writable.stripeConnect.connectDetailsOp = ops.ready({
					...ops.value(snap.readable.stripeConnect.connectDetailsOp),
					paused: false,
				})
		},
	}
}
