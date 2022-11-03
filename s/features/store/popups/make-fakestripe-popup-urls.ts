
import {Querystrings} from "./types.js"
import {encodeQuerystring} from "./utils/encode-querystring.js"

export function makeFakestripePopupUrls(base: string) {
	return {
		connect(params: Querystrings.Connect) {
			return `${base}/mocksite/fakestripe/connect?${encodeQuerystring(params)}`
		},
		login() {
			return `${base}/mocksite/fakestripe/login`
		},
		customerPortal() {
			return `${base}/mocksite/fakestripe/store-customer-portal`
		},
		checkout(params: Querystrings.Checkout) {
			return `${base}/mocksite/fakestripe/checkout?${encodeQuerystring(params)}`
		},
	}
}
