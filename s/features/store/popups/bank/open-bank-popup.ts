
import {BankPopupPayload} from "./types/bank-popup-payload.js"
import {openPopup} from "../../../../toolbox/popups/open-popup.js"
import {bankPopupNamespace} from "./common/bank-popup-namespace.js"
import {BankPopupParameters} from "./types/bank-popup-parameters.js"

export function openBankPopup({
			popupLink,
			stripeAccountId,
			stripeAccountSetupLink,
		}: {
			popupLink: string
			stripeAccountId: string
			stripeAccountSetupLink: string
		}) {

	return openPopup<BankPopupParameters, BankPopupPayload>({
		popupLink,
		namespace: bankPopupNamespace,
		parameters: {stripeAccountId, stripeAccountSetupLink},
	})
}
