
import {Id} from "dbmage"
import {centeredPopupFeatures} from "../../../toolbox/popups/centered-popup-features.js"

export interface PopupParameters {
	url: string
	popupId: string
	width?: number
	height?: number
}

export interface CheckoutPopupInfo {
	popupId: string
	success_url: string
	cancel_url: string
}

export interface CheckoutPopupResult {
	popupId: string
	status: "success" | "cancel"
}

const returnUrl = "http://localhost:8080/popups/return"

export namespace popupCoordinator {
	export namespace stripeCheckout {

		function encodeQuerystring(result: CheckoutPopupResult) {
			const searchParams = new URLSearchParams({...result})
			return searchParams.toString()
		}

		function makeUrl(id: string, success: boolean) {
			return `${returnUrl}?${encodeQuerystring({
				popupId: id,
				status: success
					? "success"
					: "cancel"
			})}`
		}

		export function generatePopupInfo(generateId: () => Id): CheckoutPopupInfo {
			const id = generateId().string
			return {
				popupId: id,
				success_url: makeUrl(id, true),
				cancel_url: makeUrl(id, false),
			}
		}
	}

	export async function openPopupAndWaitForResult({
			url,
			width = 260,
			height = 260,
			popupId,
		}: PopupParameters) {

		// TODO
		// - message origin checking should work properly
		// - popups should have unique identifiers, results must specify them

		const popup = window.open(url, "_blank", centeredPopupFeatures(width, height))

		return new Promise<CheckoutPopupResult>(resolve => {
			window.addEventListener("message", event => {
				const data = <CheckoutPopupResult>event.data
				const isFromSafeOrigin = event.origin === window.origin
				const isMatchingPopupId = data?.popupId === popupId
				if (isFromSafeOrigin && isMatchingPopupId)
					resolve(data)
				else
					console.error(`ignoring message from origin "${event.origin}" (${data})`)
			})
		})
	}
}
