
import {TriggerBankPopup} from "../../../../features/store/model/types/popups.js"
import {openBankPopup} from "../../../../features/store/popups/bank/open-bank-popup.js"

export function systemPopups({popupsBase}: {popupsBase: string}) {
	return {

		triggerBankPopup: <TriggerBankPopup>(async({stripeAccountId, stripeAccountSetupLink}) => {
			const result = openBankPopup({
				popupLink: `${popupsBase}/bank`,
				stripeAccountId,
				stripeAccountSetupLink,
			})
			return result.promisedPayload
		}),
	}
}
