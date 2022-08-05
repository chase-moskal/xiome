
// import {openPopupAndWaitForResult} from "./popup-core/open-popup-and-wait-for-result.js"

import {StripePopups} from "./types.js"

function err() {
	return new Error("TODO implement stripe popups for production")
}

export function makeStripePopups(): StripePopups {
	return {
		async connect() {
			throw err()
		},
		async login() {
			throw err()
		},
		async checkout() {
			throw err()
		},
		async checkoutPaymentMethod() {
			throw err()
		},
	}
}
