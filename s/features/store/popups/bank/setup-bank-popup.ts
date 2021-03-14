
import {BankPopupPayload} from "./types/bank-popup-payload.js"
import {bankPopupNamespace} from "./common/bank-popup-namespace.js"
import {BankPopupParameters} from "./types/bank-popup-parameters.js"
import {setupSimplePopup} from "../../../../toolbox/popups/setup-simple-popup.js"

export function setupBankPopup({allowedOrigins, action}: {
			allowedOrigins: string[]
			action: (parameters: BankPopupParameters) => Promise<BankPopupPayload>
		}) {

	setupSimplePopup<BankPopupParameters, BankPopupPayload>({
		allowedOrigins,
		namespace: bankPopupNamespace,
		action,
	})
}
