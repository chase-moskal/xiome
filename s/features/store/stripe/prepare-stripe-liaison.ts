
import {Stripe} from "stripe"
import {stripeLiaison} from "./stripe-liaison.js"
import {MakeStripeLiaison} from "./types/make-stripe-liaison.js"

export function prepareStripeLiaison({stripe, bankPopupLink}: {
			stripe: Stripe
			bankPopupLink: string
		}): MakeStripeLiaison {

	return function({tables}) {
		return stripeLiaison({stripe, tables, bankPopupLink})
	}
}
