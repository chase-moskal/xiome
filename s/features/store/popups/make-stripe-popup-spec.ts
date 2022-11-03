
import {Popups} from "./types.js"
import {encodeQuerystring} from "./utils/encode-querystring.js"

export namespace makeStripePopupSpec {

	export function connect({popupReturnUrl, generateId}: Popups.SpecParams) {
		const popupId = generateId().string
		return {
			popupId,
			return_url: `${popupReturnUrl}?${encodeQuerystring({
				popupId,
				status: "return",
			})}`,
			refresh_url: `${popupReturnUrl}?${encodeQuerystring({
				popupId,
				status: "refresh",
			})}`,
		}
	}

	export function login({generateId}: Popups.SpecParams) {
		return {popupId: generateId().string}
	}

	export function openCustomerPortal({generateId, popupReturnUrl}: Popups.SpecParams) {
		const popupId = generateId().string
		return {
			popupId,
			return_url: `${popupReturnUrl}?${encodeQuerystring({
				popupId,
				status: "return",
			})}`
		}
	}

	export function checkout({popupReturnUrl, generateId}: Popups.SpecParams) {
		const popupId = generateId().string
		return {
			popupId,
			success_url: `${popupReturnUrl}?${encodeQuerystring({
				popupId,
				status: "success",
			})}`,
			cancel_url: `${popupReturnUrl}?${encodeQuerystring({
				popupId,
				status: "cancel",
			})}`,
		}
	}
}
