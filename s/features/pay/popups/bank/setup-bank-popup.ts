
import {BankPopupPayload} from "./types/bank-popup-payload.js"
import {bankPopupNamespace} from "./common/bank-popup-namespace.js"
import {setupPopup} from "../../../../toolbox/popups/setup-popup.js"
import {BankPopupParameters} from "./types/bank-popup-parameters.js"

export function setupBankPopup({allowedOrigins, action}: {
			allowedOrigins: string[]
			action: (parameters: BankPopupParameters) => Promise<BankPopupPayload>
		}) {

	setupPopup<BankPopupParameters, BankPopupPayload>({
		allowedOrigins,
		namespace: bankPopupNamespace,
		action,
	})
}
