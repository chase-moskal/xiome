
import {BankPopupResult} from "./types/bank-popup-result.js"
import {openPopup} from "../../../../toolbox/popups/open-popup.js"
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

	return openPopup<BankPopupParameters, BankPopupResult>({
		popupLink,
		namespace: "xiome-bank-poup",
		parameters: {stripeAccountId, stripeAccountSetupLink},
	})
}
