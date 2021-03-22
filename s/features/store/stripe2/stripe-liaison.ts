
import {LiaisonOptions} from "./types/liaison-options.js"
import {stripeLiaisonProducts} from "./liaison/groups/connected/products.js"
import {stripeLiaisonCheckouts} from "./liaison/groups/connected/checkouts.js"
import {stripeLiaisonCustomers} from "./liaison/groups/connected/customers.js"
import {stripeLiaisonAccounting} from "./liaison/groups/platform/accounting.js"
import {stripeLiaisonSubscriptions} from "./liaison/groups/connected/subscriptions.js"
import {LiaisonConnectedOptions} from "./types/liaison-connected-options.js"

export function stripeLiaison(options: LiaisonOptions) {
	return {
		platform: {
			accounting: stripeLiaisonAccounting(options),
		},
		connect(stripeConnectAccountId: string) {
			const connectedOptions: LiaisonConnectedOptions = {
				...options,
				connection: {stripeAccount: stripeConnectAccountId},
			}
			return {
				customers: stripeLiaisonCustomers(connectedOptions),
				checkouts: stripeLiaisonCheckouts(connectedOptions),
				subscriptions: stripeLiaisonSubscriptions(connectedOptions),
				products: stripeLiaisonProducts(connectedOptions),
			}
		},
	}
}
