
import {LiaisonOptions} from "./types/liaison-options.js"
import {stripeLiaisonProducts} from "./liaison/products.js"
import {stripeLiaisonCheckouts} from "./liaison/checkouts.js"
import {stripeLiaisonAccounting} from "./liaison/accounting.js"
import {stripeLiaisonSubscriptions} from "./liaison/subscriptions.js"

export function stripeLiaison(options: LiaisonOptions) {
	return {
		accounting: stripeLiaisonAccounting(options),
		checkouts: stripeLiaisonCheckouts(options),
		subscriptions: stripeLiaisonSubscriptions(options),
		products: stripeLiaisonProducts(options),
	}
}
