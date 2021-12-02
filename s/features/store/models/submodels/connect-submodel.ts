
import {pub} from "../../../../toolbox/pub.js"
import {ops} from "../../../../framework/ops.js"
import {Service} from "../../../../types/service.js"
import {makeActivator} from "../utils/make-activator.js"
import {makeStoreState} from "../state/make-store-state.js"
import {TriggerBankPopup} from "../../types/store-popups.js"
import {makeStoreAllowance} from "../utils/make-store-allowance.js"
import {makeConnectService} from "../../api/services/connect-service.js"
import {StripeConnectStatus} from "../../types/store-concepts.js"

export function makeConnectSubmodel({
		state,
		allowance,
		connectService,
		triggerBankPopup,
	}: {
		state: ReturnType<typeof makeStoreState>
		allowance: ReturnType<typeof makeStoreAllowance>
		connectService: Service<typeof makeConnectService>
		triggerBankPopup: TriggerBankPopup
	}) {

	const change = pub()

	async function loadConnectDetails() {
		if (allowance.connectStripeAccount) {
			await ops.operation({
				promise: connectService.loadConnectDetails(),
				setOp: op => {
					state.writable.connectStatusOp = ops.replaceValue(
						op,
						ops.value(op)?.connectStatus
					)
					state.writable.connectDetailsOp = ops.replaceValue(
						op,
						ops.value(op)?.connectDetails
					)
				},
			})
		}
		else if (allowance.manageStore) {
			await ops.operation({
				promise: connectService.loadConnectStatus(),
				setOp: op => state.writable.connectStatusOp = op,
			})
		}
	}

	const activator = makeActivator(async() => {
		await loadConnectDetails()
	})

	return {
		activate: activator.activate,
		refresh: activator.refreshIfActivated,
		onChange: change.subscribe,

		async connectStripeAccount() {
			await triggerBankPopup(
				await connectService.generateConnectSetupLink()
			)
			await loadConnectDetails()
			await change.publish()
		},
		async pause() {
			await connectService.pause()
			state.writable.connectStatusOp = ops.ready(StripeConnectStatus.Paused)
			if (allowance.manageStore)
				state.writable.connectDetailsOp = ops.ready({
					...ops.value(state.readable.connectDetailsOp),
					paused: true,
				})
		},
		async resume() {
			await connectService.resume()
			state.writable.connectStatusOp = ops.ready(StripeConnectStatus.Ready)
			if (allowance.manageStore)
				state.writable.connectDetailsOp = ops.ready({
					...ops.value(state.readable.connectDetailsOp),
					paused: false,
				})
		},
	}
}
