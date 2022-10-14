
import {Querystrings} from "./types.js"
import {encodeQuerystring} from "./utils/encode-querystring.js"

export namespace makeFakestripePopupUrl {

	export function connect(params: Querystrings.Connect) {
		return `/mocksite/fakestripe/connect?${encodeQuerystring(params)}`
	}

	export function login() {
		return `/mocksite/fakestripe/login`
	}

	export function customerPortal() {
		return `/mocksite/fakestripe/store-customer-portal`
	}

	export function checkout(params: Querystrings.Checkout) {
		return `/mocksite/fakestripe/checkout?${encodeQuerystring(params)}`
	}

}
