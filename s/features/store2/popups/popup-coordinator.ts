
import {centeredPopupFeatures} from "../../../toolbox/popups/centered-popup-features.js"

export interface PopupParameters {
	url: string
	width: number
	height: number
}

export interface CheckoutPopupResult {
	status: "success" | "cancel"
}

export const popupCoordinator = {
	stripeCheckout: {
		encodeQuerystring(result: CheckoutPopupResult) {
			const searchParams = new URLSearchParams({...result})
			return searchParams.toString()
		},
		async openPopupAndWaitForResult({url, width, height}: PopupParameters) {
			const popup = window.open(url, centeredPopupFeatures(width, height))
			return new Promise<CheckoutPopupResult>(resolve => {
				popup.addEventListener("message", event => {
					if (event.origin === window.origin)
						resolve(event.data)
					else
						console.error(`ignoring message from origin "${event.origin}" (${event.data})`)
				})
			})
		},
	},
}
