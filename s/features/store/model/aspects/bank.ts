
import {pub} from "../../../../toolbox/pub.js"
import {ops} from "../../../../framework/ops.js"
import {Service} from "../../../../types/service.js"
import {makeActivator} from "../utils/make-activator.js"
import {makeStoreState} from "../state/make-store-state.js"
import {TriggerBankPopup} from "../shares/types/trigger-bank-popup.js"
import {makeStripeConnectService} from "../../api/services/stripe-connect-service.js"

export function makeBankSubmodel({
		state,
		stripeAccountsService,
		triggerBankPopup,
	}: {
		state: ReturnType<typeof makeStoreState>
		stripeAccountsService: Service<typeof makeStripeConnectService>
		triggerBankPopup: TriggerBankPopup
	}) {

	const bankChange = pub()

	async function loadLinkedStripeAccountDetails() {
		const details = await ops.operation({
			promise: stripeAccountsService.getConnectDetails(),
			setOp: op => state.writable.stripeAccountDetailsOp = op,
		})
		return details
	}

	const activator = makeActivator(async() => {
		await loadLinkedStripeAccountDetails()
	})

	return {
		activate: activator.activate,
		refresh: activator.refreshIfActivated,
		onBankChange: bankChange.subscribe,
		async linkStripeAccount() {
			await triggerBankPopup(
				await stripeAccountsService.generateConnectSetupLink()
			)
			await loadLinkedStripeAccountDetails()
			await bankChange.publish()
		},
	}
}
