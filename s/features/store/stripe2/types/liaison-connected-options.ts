
import {LiaisonOptions} from "./liaison-options.js"

export interface LiaisonConnectedOptions extends LiaisonOptions {
	connection: {
		stripeAccount: string
	}
}
