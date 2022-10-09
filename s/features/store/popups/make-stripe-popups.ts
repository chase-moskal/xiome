
import {StripePopups} from "./types.js"
import {mockStripePopups} from "./mock-stripe-popups.js"

export function makeStripePopups(): StripePopups {
	return mockStripePopups({mockStripeOperations: undefined})
}
