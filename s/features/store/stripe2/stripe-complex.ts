
import {LiaisonOptions} from "./types/liaison-options.js"
import {stripeLiaisonConcept} from "./liaison/stripe-liaison-for-app.js"
import {LiaisonConnectedOptions} from "./types/liaison-connected-options.js"
import {stripeLiaisonForPlatform} from "./liaison/stripe-liaison-for-platform.js"

export function stripeComplex(options: LiaisonOptions) {
	return {
		stripeLiaisonForPlatform: stripeLiaisonForPlatform(options),
		connectStripeLiaisonForApp(stripeConnectAccountId: string) {
			return stripeLiaisonConcept(<LiaisonConnectedOptions>{
				...options,
				connection: {stripeAccount: stripeConnectAccountId},
			})
		},
	}
}
