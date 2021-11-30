import {ops} from "../../../../framework/ops.js"
import {pub} from "../../../../toolbox/pub.js"
import {Service} from "../../../../types/service.js"
import {makeConnectService} from "../../api/services/connect-service.js"
import {TriggerBankPopup} from "../../types/store-popups.js"
import {makeStoreState} from "../state/make-store-state.js"
import {makeActivator} from "../utils/make-activator.js"
import {makeStoreAllowance} from "../utils/make-store-allowance.js"

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
		if (allowance.controlStoreBankLink) {
			const details = await ops.operation({
				promise: connectService.loadConnectDetails(),
				setOp: op => state.writable.connectDetailsOp = op,
			})
			return details
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
	}
}
