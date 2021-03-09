import {nap} from "../../../../toolbox/nap.js"
import {setupBankPopup} from "./setup-bank-popup.js"

void async function main() {
	setupBankPopup({
		allowedOrigins: [
			"https://xiome.io",
			"http://localhost:5000",
		],
		action: async function({stripeAccountId, stripeAccountSetupLink}) {
			console.log({stripeAccountId, stripeAccountSetupLink})
			await nap(1000 * 60 * 60 * 24)
		},
	})
}()
