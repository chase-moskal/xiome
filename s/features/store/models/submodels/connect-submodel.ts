
import {pub} from "../../../../toolbox/pub.js"
import {ops} from "../../../../framework/ops.js"
import {Service} from "../../../../types/service.js"
import {makeActivator} from "../utils/make-activator.js"
import {makeStoreState} from "../state/make-store-state.js"
import {TriggerStripeConnectPopup} from "../../types/store-popups.js"
import {StripeConnectStatus} from "../../types/store-concepts.js"
import {makeStoreAllowance} from "../utils/make-store-allowance.js"
import {makeConnectService} from "../../api/services/connect-service.js"

export function makeConnectSubmodel({
		state,
		allowance,
		connectService,
		triggerStripeConnectPopup,
	}: {
		state: ReturnType<typeof makeStoreState>
		allowance: ReturnType<typeof makeStoreAllowance>
		connectService: Service<typeof makeConnectService>
		triggerStripeConnectPopup: TriggerStripeConnectPopup
	}) {

	const change = pub()

	async function loadConnectDetails() {
		if (allowance.connectStripeAccount) {
			await ops.operation({
				promise: connectService.loadConnectDetails(),
				setOp: op => {
					state.writable.stripeConnect.connectStatusOp = ops.replaceValue(
						op,
						ops.value(op)?.connectStatus
					)
					state.writable.stripeConnect.connectDetailsOp = ops.replaceValue(
						op,
						ops.value(op)?.connectDetails
					)
				},
			})
		}
		else if (allowance.manageStore) {
			await ops.operation({
				promise: connectService.loadConnectStatus(),
				setOp: op => state.writable.stripeConnect.connectStatusOp = op,
			})
		}
	}

	const activator = makeActivator(loadConnectDetails)

	return {
		activate: activator.activate,
		refresh: activator.refreshIfActivated,
		onChange: change.subscribe,

		async connectStripeAccount() {
			await triggerStripeConnectPopup(
				await connectService.generateConnectSetupLink()
			)
			await loadConnectDetails()
			await change.publish()
		},
		async generateStripeLoginLink() {
			if (ops.value(state.readable.stripeConnect.connectStatusOp) === StripeConnectStatus.Unlinked)
				throw new Error("no stripe account to generate login link for")
			return connectService.generateStripeLoginLink()
		},
		async pause() {
			await connectService.pause()
			state.writable.stripeConnect.connectStatusOp = ops.ready(StripeConnectStatus.Paused)
			if (allowance.manageStore)
				state.writable.stripeConnect.connectDetailsOp = ops.ready({
					...ops.value(state.readable.stripeConnect.connectDetailsOp),
					paused: true,
				})
		},
		async resume() {
			await connectService.resume()
			state.writable.stripeConnect.connectStatusOp = ops.ready(StripeConnectStatus.Ready)
			if (allowance.manageStore)
				state.writable.stripeConnect.connectDetailsOp = ops.ready({
					...ops.value(state.readable.stripeConnect.connectDetailsOp),
					paused: false,
				})
		},
	}
}
