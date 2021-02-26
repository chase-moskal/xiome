
import Stripe from "stripe"
import {stripeLiaison} from "./stripe-liaison.js"
import {MakeStripeLiaison} from "./types/make-stripe-liaison.js"

export function prepareStripeLiaison(stripe: Stripe): MakeStripeLiaison {
	return function({payTables}) {
		return stripeLiaison({stripe, payTables})
	}
}
