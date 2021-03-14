
import {BankPopupPayload} from "./types/bank-popup-payload.js"
import {bankPopupNamespace} from "./common/bank-popup-namespace.js"
import {BankPopupParameters} from "./types/bank-popup-parameters.js"
import {popupTrustedOrigins} from "../../../../assembly/constants.js"
import {setupManualPopup} from "../../../../toolbox/popups/setup-manual-popup.js"

void async function main() {
	const {hash} = window.location

	const popupControls = setupManualPopup<BankPopupParameters, BankPopupPayload>({
		namespace: bankPopupNamespace,
		allowedOrigins: popupTrustedOrigins,
	})

	popupControls.sendReadyAndListenForGo(
		(targetOrigin, {stripeAccountSetupLink}) => {
			if (hash === "") {
				window.location.href = stripeAccountSetupLink
			}
			else if (hash === "#stripe-return") {
				popupControls.respondPayload(targetOrigin, undefined)
			}
			else if (hash === "#stripe-refresh") {
				popupControls.respondPayload(targetOrigin, undefined)
			}
			else {
				popupControls.respondError(
					targetOrigin,
					new Error("unknown popup context"),
				)
			}
		}
	)
}()
