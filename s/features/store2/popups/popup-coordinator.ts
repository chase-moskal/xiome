
import {centeredPopupFeatures} from "../../../toolbox/popups/centered-popup-features.js"

export interface PopupParameters {
	url: string
	width?: number
	height?: number
}

export interface CheckoutPopupResult {
	status: "success" | "cancel"
}

let popupNumber = 1

export const popupCoordinator = {
	stripeCheckout: {
		encodeQuerystring(result: CheckoutPopupResult) {
			const searchParams = new URLSearchParams({...result})
			return searchParams.toString()
		},
		async openPopupAndWaitForResult({
				url,
				width = 260,
				height = 260,
			}: PopupParameters) {
			const name = "popup" + (popupNumber++)
			const popup = window.open(url, name, centeredPopupFeatures(width, height))
			return new Promise<CheckoutPopupResult>(resolve => {
				window.addEventListener("message", event => {
					if (event.origin === window.origin) // TODO should be xiome origin (window origin is for app/community?)
						resolve(event.data)
					else
						console.error(`ignoring message from origin "${event.origin}" (${event.data})`)
				})
			})
		},
	},
}
