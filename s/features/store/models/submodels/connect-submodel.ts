
import {ops} from "../../../../framework/ops.js"
import {Service} from "../../../../types/service.js"
import {makeStoreState} from "../state/make-store-state.js"
import {StripeConnectStatus} from "../../types/store-concepts.js"
import {makeStoreAllowance} from "../utils/make-store-allowance.js"
import {TriggerStripeConnectPopup, TriggerStripeLogin} from "../../types/store-popups.js"
import {makeConnectService} from "../../api/services/connect-service.js"

export function makeConnectSubmodel({
		snap,
		allowance,
		connectService,
		triggerStripeLogin,
		triggerStripeConnectPopup,
	}: {
		snap: ReturnType<typeof makeStoreState>
		allowance: ReturnType<typeof makeStoreAllowance>
		connectService: Service<typeof makeConnectService>
		triggerStripeLogin: TriggerStripeLogin
		triggerStripeConnectPopup: TriggerStripeConnectPopup
	}) {

	async function loadConnectInfo() {
		if (allowance.connectStripeAccount) {
			await ops.operation({
				promise: connectService.loadConnectDetails(),
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
				promise: connectService.loadConnectStatus(),
				setOp: op => snap.state.stripeConnect.connectStatusOp = op,
			})
		}
	}

	function isAlreadyInitialized() {
		return !ops.isNone(snap.state.stripeConnect.connectStatusOp)
	}

	async function initialize() {
		if (allowance.connectStripeAccount && isAlreadyInitialized()) {
			await loadConnectInfo()
		}
	}

	async function refresh() {
		if (allowance.connectStripeAccount && !isAlreadyInitialized()) {
			await loadConnectInfo()
		}
	}

	return {
		initialize,
		refresh,

		async connectStripeAccount() {
			await triggerStripeConnectPopup(
				await connectService.generateConnectSetupLink()
			)
			await loadConnectInfo()
		},
		async stripeLogin() {
			const connectStatus = ops.value(snap.readable.stripeConnect.connectStatusOp)
			const connectDetails = ops.value(snap.state.stripeConnect.connectDetailsOp)
			if (connectStatus === StripeConnectStatus.Unlinked)
				throw new Error("no stripe account to generate login link for")
			if (!connectDetails)
				throw new Error("stripe connect details missing for login")
			const url = await connectService.generateStripeLoginLink()
			const {stripeAccountId} = connectDetails
			await triggerStripeLogin({stripeAccountId, url})
		},
		async pause() {
			await connectService.pause()
			snap.writable.stripeConnect.connectStatusOp = ops.ready(StripeConnectStatus.Paused)
			if (allowance.manageStore)
				snap.writable.stripeConnect.connectDetailsOp = ops.ready({
					...ops.value(snap.readable.stripeConnect.connectDetailsOp),
					paused: true,
				})
		},
		async resume() {
			await connectService.resume()
			snap.writable.stripeConnect.connectStatusOp = ops.ready(StripeConnectStatus.Ready)
			if (allowance.manageStore)
				snap.writable.stripeConnect.connectDetailsOp = ops.ready({
					...ops.value(snap.readable.stripeConnect.connectDetailsOp),
					paused: false,
				})
		},
	}
}
